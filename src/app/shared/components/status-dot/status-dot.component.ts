import { Component, input } from '@angular/core';
import { ProjectStatus } from '../../../core/models/project.model';

@Component({
  selector: 'app-status-dot',
  imports: [],
  templateUrl: './status-dot.component.html',
  styleUrl: './status-dot.component.scss',
})
export class StatusDotComponent {
  readonly status = input.required<ProjectStatus>();
}
