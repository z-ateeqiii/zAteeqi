import { Component, inject } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { StatusDotComponent } from '../../../shared/components/status-dot/status-dot.component';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-projects-grid',
  imports: [StatusDotComponent, RevealOnScrollDirective],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
})
export class ProjectsGridComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly analytics = inject(AnalyticsService);

  readonly projects = this.projectsService.publicProjects;

  onLinkClick(kind: 'live' | 'source', slug: string): void {
    void this.analytics.trackCtaClick(`${kind}:${slug}`);
  }
}
