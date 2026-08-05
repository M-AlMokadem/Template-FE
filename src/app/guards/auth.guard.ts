import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);


  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => authService.hasRole(role));
    if (!hasRequiredRole) {
      toastService.showError('You do not have permission to access this page.');
      return router.createUrlTree(['/']);
    }
  }
  if (authService.isAuthenticated()) {
    return true;
  }

  toastService.showError('Please sign in to access this page.');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
