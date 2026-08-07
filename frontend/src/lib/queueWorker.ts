import { logger } from "@/lib/logger";

export type JobType =
  | "EMAIL_ORDER_CONFIRMATION"
  | "EMAIL_SHIPPING_UPDATE"
  | "NOTIFICATION_DISPATCH"
  | "ANALYTICS_AGGREGATION"
  | "GENERATE_INVOICE";

export interface BackgroundJob {
  id: string;
  type: JobType;
  payload: Record<string, any>;
  createdAt: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

const jobQueue: BackgroundJob[] = [];

export const queueWorker = {
  enqueue: (type: JobType, payload: Record<string, any>): string => {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const job: BackgroundJob = {
      id: jobId,
      type,
      payload,
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    jobQueue.push(job);
    logger.info(`Enqueue background job [${type}]`, { meta: { jobId, type } });

    // Process job asynchronously in background without blocking API execution
    setTimeout(() => {
      queueWorker.processNextJob();
    }, 10);

    return jobId;
  },

  processNextJob: async () => {
    const job = jobQueue.find((j) => j.status === "PENDING");
    if (!job) return;

    job.status = "PROCESSING";

    try {
      switch (job.type) {
        case "EMAIL_ORDER_CONFIRMATION":
          logger.info(`[WORKER] Emailing order confirmation for order #${job.payload.orderId}`);
          break;

        case "EMAIL_SHIPPING_UPDATE":
          logger.info(`[WORKER] Emailing shipping update for order #${job.payload.orderId}`);
          break;

        case "NOTIFICATION_DISPATCH":
          logger.info(`[WORKER] Dispatching push notification to ${job.payload.recipientId}`);
          break;

        case "ANALYTICS_AGGREGATION":
          logger.info(`[WORKER] Aggregating daily marketplace revenue metrics`);
          break;

        case "GENERATE_INVOICE":
          logger.info(`[WORKER] Generating PDF invoice document for order #${job.payload.orderId}`);
          break;

        default:
          logger.warn(`Unknown job type: ${job.type}`);
      }

      job.status = "COMPLETED";
    } catch (err: any) {
      job.status = "FAILED";
      logger.error(`Background job failed [${job.type}]`, { meta: { jobId: job.id, error: err.message } });
    }
  },
};
