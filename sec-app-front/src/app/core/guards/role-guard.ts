import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  
  if (authService.hasRole(requiredRoles)) {
    return true;
  }

  // Si no tiene el rol, redirigir al home o login
  return router.createUrlTree(['/app/home']);
};
