import { logger } from "@/lib/logger";

export interface StockReservationRequest {
  productId: string;
  quantity: number;
  orderId: string;
}

export const inventoryService = {
  reserveStock: async (req: StockReservationRequest): Promise<boolean> => {
    logger.info(`[INVENTORY SERVICE] Reserving ${req.quantity} units for Product #${req.productId}`, {
      meta: { orderId: req.orderId },
    });
    return true;
  },

  releaseStock: async (productId: string, quantity: number, orderId: string): Promise<boolean> => {
    logger.info(`[INVENTORY SERVICE] Releasing ${quantity} units for Product #${productId}`, {
      meta: { orderId },
    });
    return true;
  },
};
