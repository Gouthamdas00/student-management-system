import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Current User Role:', authService.userRole());
  console.log('Is User?:', authService.isUser());

  if (authService.isUser()) {
    console.warn('roleGuard: Redirecting user to dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};