import { connectDB } from "@/lib/mongodb";
import { OutboxEvent } from "@/models/OutboxEvent";
import { logger } from "@/lib/logger";

export const outboxWorker = {
  processPendingEvents: async (): Promise<number> => {
    let processedCount = 0;
    try {
      await connectDB();
      const pendingEvents = await OutboxEvent.find({
        status: { $in: ["PENDING", "FAILED"] },
        retryCount: { $lt: 5 },
      })
        .sort({ createdAt: 1 })
        .limit(20);

      for (const event of pendingEvents) {
        event.status = "PROCESSING";
        await event.save();

        try {
          // Dispatch event to consumers
          logger.info(`[OUTBOX WORKER] Dispatching outbox event ${event.eventType}`, {
            meta: { eventId: event.eventId, aggregateId: event.aggregateId },
          });

          event.status = "COMPLETED";
          event.processedAt = new Date();
          await event.save();
          processedCount++;
        } catch (err: any) {
          event.retryCount += 1;
          event.lastError = err.message;
          event.status = event.retryCount >= 5 ? "FAILED" : "PENDING";
          await event.save();
          logger.error(`Outbox event processing failed`, {
            meta: { eventId: event.eventId, error: err.message, retryCount: event.retryCount },
          });
        }
      }
    } catch (err: any) {
      logger.error("Outbox worker execution error", { meta: { error: err.message } });
    }
    return processedCount;
  },
};
