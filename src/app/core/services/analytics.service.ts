import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { AnalyticsEventWithId } from '../models/analytics-event.model';

const SESSION_ID_KEY = 'zateeqi_session_id';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly firestore = inject(Firestore);
  private readonly eventsCollection = collection(this.firestore, 'analytics_events');

  readonly events = toSignal(
    collectionData(this.eventsCollection, { idField: 'id' }) as Observable<
      AnalyticsEventWithId[]
    >,
    { initialValue: [] },
  );

  private getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  async trackPageview(): Promise<void> {
    await addDoc(this.eventsCollection, {
      type: 'pageview',
      sessionId: this.getSessionId(),
      createdAt: serverTimestamp(),
    });
  }

  async trackCtaClick(target: string): Promise<void> {
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
