import { Component } from '@angular/core';
import { ABOUT_COPY, SKILL_GROUPS } from '../../../core/data/site-content.data';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [RevealOnScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly aboutCopy = ABOUT_COPY;
  readonly skillGroups = SKILL_GROUPS;
}
