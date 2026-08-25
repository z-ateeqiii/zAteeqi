import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../../core/services/projects.service';
import { ProjectWithId } from '../../../core/models/project.model';
import { StatusDotComponent } from '../../../shared/components/status-dot/status-dot.component';

@Component({
  selector: 'app-project-row',
  imports: [ReactiveFormsModule, StatusDotComponent],
  templateUrl: './project-row.component.html',
  styleUrl: './project-row.component.scss',
})
export class ProjectRowComponent implements OnInit {
  readonly project = input.required<ProjectWithId>();

  private readonly fb = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);

  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    route: ['', Validators.required],
    description: ['', Validators.required],
    tags: [''],
    liveUrl: ['', Validators.required],
    githubUrl: ['', Validators.required],
    status: ['draft' as 'live' | 'draft', Validators.required],
    order: [1, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const project = this.project();
    this.form.setValue({
      title: project.title,
      route: project.route,
      description: project.description,
      tags: project.tags.join(', '),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      status: project.status,
      order: project.order,
    });
  }

  async onSave(): Promise<void> {
    if (this.form.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    const value = this.form.getRawValue();

    try {
      await this.projectsService.updateProject(this.project().id, {
        title: value.title,
        route: value.route,
        description: value.description,
        tags: value.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        liveUrl: value.liveUrl,
        githubUrl: value.githubUrl,
        status: value.status,
        order: value.order,
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete(): Promise<void> {
    if (this.isDeleting()) return;
    const confirmed = confirm(`Delete "${this.project().title}"? This cannot be undone.`);
    if (!confirmed) return;

    this.isDeleting.set(true);
    try {
      await this.projectsService.deleteProject(this.project().id);
    } finally {
      this.isDeleting.set(false);
    }
  }
}
