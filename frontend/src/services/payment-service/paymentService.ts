import { logger } from "@/lib/logger";

export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export const paymentService = {
  processPaymentIntent: async (req: PaymentIntentRequest) => {
    logger.info(`[PAYMENT SERVICE] Processing payment intent for Order #${req.orderId}`, {
      meta: { amount: req.amount },
    });

    return {
      success: true,
      paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientSecret: `cs_${Date.now()}_secret`,
      status: "requires_payment_method",
    };
  },

  refundPayment: async (paymentIntentId: string, amount?: number) => {
    logger.info(`[PAYMENT SERVICE] Issuing refund for ${paymentIntentId}`, { meta: { amount } });
    return {
      success: true,
      refundId: `re_${Date.now()}`,
      status: "succeeded",
    };
  },
};
