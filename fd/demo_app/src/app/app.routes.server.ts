import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'departments/edit/:id',
    renderMode: RenderMode.Client // Renders on the browser when navigated to
  },
  {
    path: 'departments/:id/staff',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // Keeps SSG for static routes
  }
];