import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../security/security.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);
  if (securityService.getRol()=== 'admin') {
    return true;
  }
  router.navigate(['/login']);
  return true;
};
