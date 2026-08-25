import { Component, inject } from '@angular/core';
import { PROFILE } from '../../../core/data/site-content.data';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-contact',
  imports: [RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly analytics = inject(AnalyticsService);

  readonly profile = PROFILE;

  onCtaClick(target: string): void {
    void this.analytics.trackCtaClick(target);
  }
}
