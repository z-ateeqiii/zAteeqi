import { Routes } from '@angular/router';
import { PublicSiteComponent } from './features/public-site/public-site.component';

export const routes: Routes = [
  { path: '', component: PublicSiteComponent },
  {
    // Lazy-loaded: the admin UI (login, dashboard, project forms, and
    // ReactiveFormsModule) is only ever needed by Muhammed, so keeping it out
    // of the initial bundle spares every public visitor the download.
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '**', redirectTo: '' },
];
