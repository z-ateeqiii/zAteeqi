import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import {
  Firestore,
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
import { STARTER_PROJECTS } from '../data/starter-projects.data';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly firestore = inject(Firestore);
  private readonly projectsCollection = collection(this.firestore, 'projects');

  private readonly publicQuery = query(
    this.projectsCollection,
    where('status', '==', 'live'),
    orderBy('order'),
  );
  private readonly allQuery = query(this.projectsCollection, orderBy('order'));

  readonly publicProjects = toSignal(
    collectionData(this.publicQuery, { idField: 'id' }) as Observable<ProjectWithId[]>,
    { initialValue: [] },
  );

  readonly allProjects = toSignal(
    collectionData(this.allQuery, { idField: 'id' }) as Observable<ProjectWithId[]>,
    { initialValue: [] },
  );

  async saveProject(id: string, project: Project): Promise<void> {
    await setDoc(doc(this.firestore, 'projects', id), project);
  }

  async updateProject(id: string, changes: Partial<Project>): Promise<void> {
    await updateDoc(doc(this.firestore, 'projects', id), changes);
  }

  async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'projects', id));
  }

  async seedStarterProjects(): Promise<void> {
    await Promise.all(
      Object.entries(STARTER_PROJECTS).map(([id, project]) => this.saveProject(id, project)),
    );
  }
}
