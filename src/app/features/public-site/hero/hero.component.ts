import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HERO_COPY, PROFILE, STATUS_STRIP } from '../../../core/data/site-content.data';

const BOOT_LINES = [
  '> initializing session...',
  '> role: visitor · access: granted',
  '> loading /home',
];

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly analytics = inject(AnalyticsService);

  readonly heroCopy = HERO_COPY;
  readonly profile = PROFILE;
  readonly statusStrip = STATUS_STRIP;
  readonly bootLines = BOOT_LINES;

  readonly visibleLineCount = signal(0);
  readonly bootComplete = computed(() => this.visibleLineCount() >= this.bootLines.length);

  readonly liveProjectCount = computed(() => this.projectsService.publicProjects().length);

  ngOnInit(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.visibleLineCount.set(this.bootLines.length);
      return;
    }

    this.bootLines.forEach((_, index) => {
      setTimeout(() => this.visibleLineCount.update((count) => count + 1), 450 * (index + 1));
    });
  }

  onCtaClick(target: string): void {
    void this.analytics.trackCtaClick(target);
  }
}
