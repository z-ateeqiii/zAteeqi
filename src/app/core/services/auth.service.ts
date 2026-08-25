import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, User, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { isFirebaseConfigured } from '../firebase/firebase.providers';

/** Thrown instead of a Firebase error when the project has no real config yet. */
export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super('Firebase is not configured — add your project config to src/environments/.');
    this.name = 'FirebaseNotConfiguredError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Matches the guard in ProjectsService/AnalyticsService: while the repo still
   * ships `REPLACE_WITH_*` placeholders, Auth stays inert. Without this, a
   * sign-in attempt fails deep inside Firebase with `auth/api-key-not-valid`,
   * which the login form would report as a wrong password.
   */
  readonly isEnabled = isFirebaseConfigured();

  private readonly auth = this.isEnabled ? inject(Auth) : null;

  readonly currentUser: Signal<User | null> = this.auth
    ? toSignal(user(this.auth), { initialValue: null })
    : signal<User | null>(null).asReadonly();

  readonly isSignedIn = computed(() => this.currentUser() !== null);
  readonly userEmail = computed(() => this.currentUser()?.email ?? null);

  async signIn(email: string, password: string): Promise<void> {
    if (!this.auth) throw new FirebaseNotConfiguredError();
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOutUser(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
  }
}
