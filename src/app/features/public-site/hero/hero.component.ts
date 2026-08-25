import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HERO_COPY, PROFILE, STATUS_STRIP } from '../../../core/data/site-content.data';

export interface BootLine {
  prompt: string;
  text: string;
}

/** Spec 2.3 — the hero boot sequence, rendered one line at a time. */
const BOOT_LINES: BootLine[] = [
  { prompt: '>', text: 'initializing session...' },
  { prompt: '>', text: 'role: visitor · access: granted' },
  { prompt: '>', text: 'loading /home' },
];

const BOOT_LINE_DELAY_MS = 420;

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly projectsService = inject(ProjectsService);
  private readonly analytics = inject(AnalyticsService);

  readonly heroCopy = HERO_COPY;
  readonly profile = PROFILE;
  readonly statusStrip = STATUS_STRIP;
  readonly bootLines = BOOT_LINES;

  readonly visibleLineCount = signal(0);
  readonly bootComplete = computed(() => this.visibleLineCount() >= this.bootLines.length);

  readonly liveProjectCount = computed(() => this.projectsService.publicProjects().length);

  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.visibleLineCount.set(this.bootLines.length);
      return;
    }

    this.timers = this.bootLines.map((_, index) =>
      setTimeout(
        () => this.visibleLineCount.update((count) => Math.max(count, index + 1)),
        BOOT_LINE_DELAY_MS * (index + 1),
      ),
    );
  }

  ngOnDestroy(): void {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers = [];
  }

  /** The cursor rides the newest line, so it lands on the last one. */
  isCursorLine(index: number): boolean {
    return index === this.visibleLineCount() - 1;
  }

  onCtaClick(target: string): void {
    void this.analytics.trackCtaClick(target);
  }
}
