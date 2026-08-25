import { Component, inject } from '@angular/core';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [TopbarComponent, AdminLoginComponent, AdminDashboardComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private readonly auth = inject(AuthService);

  readonly isSignedIn = this.auth.isSignedIn;
}
