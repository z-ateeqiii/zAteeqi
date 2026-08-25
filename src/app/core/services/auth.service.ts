import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);

  readonly currentUser = toSignal(user(this.auth), { initialValue: null });
  readonly isSignedIn = computed(() => this.currentUser() !== null);
  readonly userEmail = computed(() => this.currentUser()?.email ?? null);

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOutUser(): Promise<void> {
    await signOut(this.auth);
  }
}
