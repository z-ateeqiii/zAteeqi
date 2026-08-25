import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectRowComponent } from '../project-row/project-row.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ProjectFormComponent, ProjectRowComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly projectsService = inject(ProjectsService);
  private readonly analytics = inject(AnalyticsService);

  readonly projects = this.projectsService.allProjects;
  readonly userEmail = this.auth.userEmail;

  readonly isSeeding = signal(false);
  readonly seedMessage = signal<string | null>(null);

  readonly summary = computed(() => this.analytics.summarize(this.analytics.events()));

  async onSeedStarterProjects(): Promise<void> {
    if (this.isSeeding()) return;
    this.isSeeding.set(true);
    this.seedMessage.set(null);
    try {
      await this.projectsService.seedStarterProjects();
      this.seedMessage.set('Starter projects seeded.');
    } catch {
      this.seedMessage.set('Could not seed starter projects.');
    } finally {
      this.isSeeding.set(false);
    }
  }

  async onSignOut(): Promise<void> {
    await this.auth.signOutUser();
  }
}
