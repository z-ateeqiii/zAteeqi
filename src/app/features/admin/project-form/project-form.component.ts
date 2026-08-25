import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    title: ['', Validators.required],
    route: ['', Validators.required],
    description: ['', Validators.required],
    tags: [''],
    liveUrl: ['', Validators.required],
    githubUrl: ['', Validators.required],
    status: ['draft' as 'live' | 'draft', Validators.required],
    order: [1, [Validators.required, Validators.min(0)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();

    try {
      await this.projectsService.saveProject(value.id, {
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
      this.form.reset({ status: 'draft', order: 1, tags: '' });
    } catch {
      this.errorMessage.set('Could not save the project. Try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
