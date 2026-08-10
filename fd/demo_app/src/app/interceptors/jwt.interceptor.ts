import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;

  // Safely check if we are running in a browser environment where localStorage exists
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (token) {
    console.log("Interceptor found token safely! Attaching to request...");
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn("Interceptor: No token found in localStorage.");
  }

  return next(req);
};