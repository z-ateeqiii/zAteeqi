import { Component } from '@angular/core';
import { EXPERIENCE } from '../../../core/data/site-content.data';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-experience-timeline',
  imports: [RevealOnScrollDirective],
  templateUrl: './experience-timeline.component.html',
  styleUrl: './experience-timeline.component.scss',
})
export class ExperienceTimelineComponent {
  readonly experience = EXPERIENCE;
}
