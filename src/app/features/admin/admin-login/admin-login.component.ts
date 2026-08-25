import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, FirebaseNotConfiguredError } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Drives an up-front notice, so the form isn't offered as if it could work. */
  readonly isFirebaseReady = this.auth.isEnabled;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.signIn(email, password);
    } catch (error) {
      this.errorMessage.set(
        error instanceof FirebaseNotConfiguredError
          ? 'Firebase is not configured yet — add your project config to src/environments/.'
          : 'Sign-in failed. Check your email and password.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
