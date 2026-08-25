import {
  AfterViewInit,
  Component,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

export interface TopbarSection {
  id: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements AfterViewInit, OnDestroy {
  readonly sections = input<TopbarSection[]>([]);
  readonly staticPath = input<string | null>(null);
  readonly guestLabel = input('visitor');

  private readonly auth = inject(AuthService);

  readonly isMenuOpen = signal(false);
  private readonly activeSectionId = signal<string | null>(null);
  private observer?: IntersectionObserver;

  readonly activePath = computed(() => {
    const sections = this.sections();
    if (sections.length === 0) {
      return this.staticPath() ?? '/';
    }
    const active = sections.find((section) => section.id === this.activeSectionId());
    return active?.path ?? sections[0].path;
  });

  readonly roleLabel = computed(() => {
    const email = this.auth.userEmail();
    return email ? `role: admin (${email})` : `role: ${this.guestLabel()}`;
  });

  ngAfterViewInit(): void {
    const sections = this.sections();
    if (sections.length === 0) return;

    this.activeSectionId.set(sections[0].id);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSectionId.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) this.observer.observe(element);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  isActive(section: TopbarSection): boolean {
    return this.activePath() === section.path;
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.closeMenu();
  }
}
