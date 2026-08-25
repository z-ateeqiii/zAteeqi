import { Routes } from '@angular/router';
import { PublicSiteComponent } from './features/public-site/public-site.component';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  { path: '', component: PublicSiteComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
