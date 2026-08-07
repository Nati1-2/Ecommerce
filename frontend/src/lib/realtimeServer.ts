import { logger } from "@/lib/logger";

export type RealtimeEventType =
  | "ORDER_CREATED"
  | "ORDER_ACCEPTED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "PAYMENT_FAILED";

export interface RealtimeEventPayload {
  event: RealtimeEventType;
  orderId: string;
  recipientId?: string;
  data: Record<string, any>;
  timestamp: string;
}

type EventListener = (payload: RealtimeEventPayload) => void;

class RealtimeEventBus {
  private listeners: Map<RealtimeEventType, Set<EventListener>> = new Map();

  subscribe(event: RealtimeEventType, listener: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  publish(event: RealtimeEventType, orderId: string, data: Record<string, any> = {}, recipientId?: string) {
    const payload: RealtimeEventPayload = {
      event,
      orderId,
      recipientId,
      data,
      timestamp: new Date().toISOString(),
    };

    logger.info(`[PUBSUB EVENT] ${event} published for Order #${orderId}`, { meta: { event, orderId } });

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err: any) {
          logger.error(`Error in event listener for ${event}`, { meta: { error: err.message } });
        }
      });
    }
  }
}

export const realtimeServer = new RealtimeEventBus();
