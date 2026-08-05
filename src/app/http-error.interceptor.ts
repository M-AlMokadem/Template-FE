import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from './services/toast.service';

function toFriendlyMessage(error: HttpErrorResponse): string {
  const backendMessage = error.error?.message;
  if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  const validationErrors = error.error?.errors;
  if (validationErrors && typeof validationErrors === 'object') {
    const firstError = Object.values(validationErrors).flat().find((value) => typeof value === 'string');
    if (typeof firstError === 'string' && firstError.trim().length > 0) {
      return firstError;
    }
  }

  if (error.status === 0) {
    return 'Unable to reach the server. Please check your connection.';
  }

  if (error.status >= 500) {
    return 'A server error occurred. Please try again.';
  }

  return 'Request failed. Please review your input and try again.';
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const isAuthRoute = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');
        if (!isAuthRoute) {
          toast.showError(toFriendlyMessage(error));
        }
      }

      return throwError(() => error);
    })
  );
};
