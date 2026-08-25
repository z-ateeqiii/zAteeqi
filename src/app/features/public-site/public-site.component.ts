import { Component, OnInit, inject } from '@angular/core';
import { TopbarComponent, TopbarSection } from '../../shared/components/topbar/topbar.component';
import { HeroComponent } from './hero/hero.component';
import { ProjectsGridComponent } from './projects-grid/projects-grid.component';
import { AboutComponent } from './about/about.component';
import { ExperienceTimelineComponent } from './experience-timeline/experience-timeline.component';
import { ContactComponent } from './contact/contact.component';
import { AnalyticsService } from '../../core/services/analytics.service';

const SECTIONS: TopbarSection[] = [
  { id: 'home', label: 'Home', path: '/home' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

@Component({
  selector: 'app-public-site',
  imports: [
    TopbarComponent,
    HeroComponent,
    ProjectsGridComponent,
    AboutComponent,
    ExperienceTimelineComponent,
    ContactComponent,
  ],
  templateUrl: './public-site.component.html',
  styleUrl: './public-site.component.scss',
})
export class PublicSiteComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  readonly sections = SECTIONS;

  ngOnInit(): void {
    void this.analytics.trackPageview();
  }
}
