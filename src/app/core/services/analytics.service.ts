import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { AnalyticsEventWithId } from '../models/analytics-event.model';
import { isFirebaseConfigured } from '../firebase/firebase.providers';

const SESSION_ID_KEY = 'zateeqi_session_id';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  /** No Firebase project yet means analytics is a no-op rather than a crash. */
  readonly isEnabled = isFirebaseConfigured();

  private readonly firestore = this.isEnabled ? inject(Firestore) : null;
  private readonly eventsCollection = this.firestore
    ? collection(this.firestore, 'analytics_events')
    : null;

  readonly events = this.eventsCollection
    ? toSignal(
        collectionData(this.eventsCollection, { idField: 'id' }).pipe(
          catchError(() => of([])),
        ) as unknown as Observable<AnalyticsEventWithId[]>,
        { initialValue: [] as AnalyticsEventWithId[] },
      )
    : signal<AnalyticsEventWithId[]>([]).asReadonly();

  private getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  async trackPageview(): Promise<void> {
    if (!this.eventsCollection) return;
    await addDoc(this.eventsCollection, {
      type: 'pageview',
      sessionId: this.getSessionId(),
      createdAt: serverTimestamp(),
    });
  }

  async trackCtaClick(target: string): Promise<void> {
    if (!this.eventsCollection) return;
    await addDoc(this.eventsCollection, {
      type: 'cta_click',
      target,
      sessionId: this.getSessionId(),
      createdAt: serverTimestamp(),
    });
  }

  summarize(events: AnalyticsEventWithId[]) {
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map((event) => event.sessionId)).size;

    const byDay = new Map<string, number>();
    for (const event of events) {
      const date = (event.createdAt as unknown as Timestamp | null)?.toDate?.();
      if (!date) continue;
      const day = date.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    const byTarget = new Map<string, number>();
    for (const event of events) {
      if (event.type !== 'cta_click' || !event.target) continue;
      byTarget.set(event.target, (byTarget.get(event.target) ?? 0) + 1);
    }

    return {
      totalEvents,
      uniqueSessions,
      byDay: [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)),
      byTarget: [...byTarget.entries()].sort(([, a], [, b]) => b - a),
    };
  }
}
