import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService, AUTH_SESSION_STORAGE_KEY } from './services/auth.service';

const REFRESH_RETRIED = new HttpContextToken<boolean>(() => false);

function isApiRequest(url: string): boolean {
  return url.startsWith('http://localhost:5186/api/');
}

function isAuthEndpoint(url: string): boolean {
  return url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/refresh') ||
    url.includes('/api/auth/logout');
}

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url) || typeof localStorage === 'undefined') {
    return next(req);
  }

  const authService = inject(AuthService);
  const rawSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  let accessToken: string | undefined;

  if (rawSession) {
    try {
      accessToken = (JSON.parse(rawSession) as { accessToken?: string }).accessToken;
    } catch {
      accessToken = undefined;
    }
  }

  const authorizedRequest = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      const shouldRefresh = error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isAuthEndpoint(req.url) &&
        !req.context.get(REFRESH_RETRIED) &&
        Boolean(accessToken);

      if (!shouldRefresh) {
        return throwError(() => error);
      }

      return from(authService.refresh()).pipe(
        switchMap(() => {
          const refreshedToken = authService.getAccessToken();
          if (!refreshedToken) {
            authService.clearSession();
            return throwError(() => error);
          }

          const retriedRequest = req.clone({
            context: req.context.set(REFRESH_RETRIED, true),
            setHeaders: { Authorization: `Bearer ${refreshedToken}` }
          });

          return next(retriedRequest);
        }),
        catchError((refreshError: unknown) => {
          authService.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
