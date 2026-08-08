import { OutboxEvent } from "@/models/OutboxEvent";
import { EnterpriseEventType } from "@/events/eventTypes";
import { logger } from "@/lib/logger";

export const orderProducer = {
  publishOrderEvent: async (eventType: EnterpriseEventType, orderId: string, payload: Record<string, any>) => {
    try {
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await OutboxEvent.create({
        eventId,
        aggregateId: orderId,
        aggregateType: "Order",
        eventType,
        payload,
        status: "PENDING",
      });
      logger.info(`[ORDER PRODUCER] Stored outbox event ${eventType}`, { meta: { eventId, orderId } });
    } catch (err: any) {
      logger.error(`Failed to produce order event ${eventType}`, { meta: { orderId, error: err.message } });
    }
  },
};
