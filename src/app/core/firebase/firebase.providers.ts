import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

/**
 * True once `environment.firebase` holds real values rather than the
 * `REPLACE_WITH_*` placeholders the repo ships with.
 *
 * Services use this to stay inert until a Firebase project actually exists:
 * without it, the very first Firestore read rejects, the injector tears the
 * component down, and whole sections of the page silently fail to render.
 */
export function isFirebaseConfigured(): boolean {
  const config = environment.firebase;
  return Object.values(config).every(
    (value) => typeof value === 'string' && value.length > 0 && !value.includes('REPLACE_WITH'),
  );
}

export function provideFirebase(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]);
}
