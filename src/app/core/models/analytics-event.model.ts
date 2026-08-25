import { Timestamp } from '@angular/fire/firestore';

export type AnalyticsEventType = 'pageview' | 'cta_click';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  target?: string;
  sessionId: string;
  createdAt: Timestamp;
}

export interface AnalyticsEventWithId extends AnalyticsEvent {
  id: string;
}
