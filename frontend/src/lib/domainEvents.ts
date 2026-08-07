import { logger } from "@/lib/logger";

export type DomainEventType =
  | "OrderCreated"
  | "PaymentCompleted"
  | "PaymentFailed"
  | "InventoryReserved"
  | "OrderShipped"
  | "UserRegistered";

export interface DomainEvent<T = any> {
  eventId: string;
  type: DomainEventType;
  aggregateId: string;
  payload: T;
  timestamp: string;
  correlationId?: string;
}

type DomainEventListener<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

class DomainEventPublisher {
  private handlers: Map<DomainEventType, Set<DomainEventListener>> = new Map();

  subscribe<T>(type: DomainEventType, listener: DomainEventListener<T>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(listener as DomainEventListener);
  }

  async publish<T>(type: DomainEventType, aggregateId: string, payload: T, correlationId?: string) {
    const event: DomainEvent<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type,
      aggregateId,
      payload,
      timestamp: new Date().toISOString(),
      correlationId: correlationId || `trace_${Date.now()}`,
    };

    logger.info(`[DOMAIN EVENT] ${type} published for aggregate [${aggregateId}]`, {
      meta: { eventId: event.eventId, correlationId: event.correlationId },
    });

    const listeners = this.handlers.get(type);
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        try {
          await listener(event);
        } catch (err: any) {
          logger.error(`Error in domain event consumer for ${type}`, {
            meta: { eventId: event.eventId, error: err.message },
          });
        }
      }
    }
  }
}

export const domainEvents = new DomainEventPublisher();
