import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import {
  DocumentData,
  Firestore,
  Query,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Project, ProjectWithId } from '../models/project.model';
import { STARTER_LIVE_PROJECTS, STARTER_PROJECTS } from '../data/starter-projects.data';
import { isFirebaseConfigured } from '../firebase/firebase.providers';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  /**
   * Firestore is only touched once real credentials are in place. While the
   * project is unconfigured every read short-circuits to an empty stream, so
   * nothing throws during construction and the public site still renders.
   */
  readonly isRemoteEnabled = isFirebaseConfigured();

  private readonly firestore = this.isRemoteEnabled ? inject(Firestore) : null;

  private readonly remotePublicProjects = this.readCollection((firestore) =>
    query(collection(firestore, 'projects'), where('status', '==', 'live'), orderBy('order')),
  );

  private readonly remoteAllProjects = this.readCollection((firestore) =>
    query(collection(firestore, 'projects'), orderBy('order')),
  );

  /**
   * What the public site renders. Firestore wins whenever it returns rows;
   * otherwise the local seed data keeps the grid and the "live projects"
   * counter populated instead of showing an empty section.
   */
  readonly publicProjects = computed<ProjectWithId[]>(() => {
    const remote = this.remotePublicProjects();
    return remote.length > 0 ? remote : STARTER_LIVE_PROJECTS;
  });

  /** True when the grid is showing seed data rather than Firestore rows. */
  readonly isUsingFallback = computed(() => this.remotePublicProjects().length === 0);

  /**
   * The admin dashboard deliberately has no fallback: it must show exactly
   * what is in Firestore, or the "Seed starter projects" button would look
   * like it had already run.
   */
  readonly allProjects = this.remoteAllProjects;

  private readCollection(
    buildQuery: (firestore: Firestore) => Query<DocumentData, DocumentData>,
  ): Signal<ProjectWithId[]> {
    const firestore = this.firestore;
    if (!firestore) return signal<ProjectWithId[]>([]).asReadonly();

    const stream = collectionData(buildQuery(firestore), { idField: 'id' }).pipe(
      catchError((error: unknown) => {
        console.warn('[projects] Firestore read failed, falling back to seed data.', error);
        return of([]);
      }),
    ) as unknown as Observable<ProjectWithId[]>;

    return toSignal(stream, { initialValue: [] as ProjectWithId[] });
  }

  private requireFirestore(): Firestore {
    if (!this.firestore) {
      throw new Error(
        'Firebase is not configured yet — fill in src/environments/environment.ts before writing.',
      );
    }
    return this.firestore;
  }

  async saveProject(id: string, project: Project): Promise<void> {
    await setDoc(doc(this.requireFirestore(), 'projects', id), project);
  }

  async updateProject(id: string, changes: Partial<Project>): Promise<void> {
    await updateDoc(doc(this.requireFirestore(), 'projects', id), changes);
  }

  async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(this.requireFirestore(), 'projects', id));
  }

  async seedStarterProjects(): Promise<void> {
    await Promise.all(
      Object.entries(STARTER_PROJECTS).map(([id, project]) => this.saveProject(id, project)),
    );
  }
}
