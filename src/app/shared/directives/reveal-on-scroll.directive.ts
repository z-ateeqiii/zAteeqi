import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    class: 'reveal-on-scroll',
  },
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  readonly revealDelayMs = input(0, { alias: 'appRevealOnScroll' });

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const element = this.elementRef.nativeElement;

    if (prefersReducedMotion) {
      element.classList.add('is-revealed');
      return;
    }

    element.style.transitionDelay = `${this.revealDelayMs()}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-revealed');
          this.observer?.unobserve(element);
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
