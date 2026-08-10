import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. Import provideHttpClient and withInterceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
// 2. Import your functional interceptor
import { jwtInterceptor } from './interceptors/jwt.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // 3. Register provideHttpClient WITH your interceptor here!
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
};