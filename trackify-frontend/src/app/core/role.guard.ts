import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './types';

export const roleGuard = (roles: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.token && auth.hasRole(roles)) return true;
    router.navigate(['/']);
    return false;
  };
};
