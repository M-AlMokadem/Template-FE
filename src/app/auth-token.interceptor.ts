import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_SESSION_STORAGE_KEY } from './services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://localhost:5186/api/')) {
    return next(req);
  }

  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const rawSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return next(req);
  }

  try {
    const parsed = JSON.parse(rawSession) as { accessToken?: string };
    const accessToken = parsed?.accessToken;

    if (!accessToken) {
      return next(req);
    }

    const authorizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next(authorizedRequest);
  } catch {
    return next(req);
  }
};
