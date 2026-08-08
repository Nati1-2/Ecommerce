import { logger } from "@/lib/logger";

export type CarrierName = "FedEx Express" | "DHL Express" | "UPS Worldwide" | "USPS Priority";

export interface CreateShipmentRequest {
  orderId: string;
  carrier: CarrierName;
  recipientAddress: string;
}

export const shippingService = {
  createShipment: async (req: CreateShipmentRequest) => {
    const trackingNumber = `TRK-${req.carrier.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    logger.info(`[SHIPPING SERVICE] Shipment created with ${req.carrier}`, {
      meta: { orderId: req.orderId, trackingNumber },
    });

    return {
      success: true,
      orderId: req.orderId,
      carrier: req.carrier,
      trackingNumber,
      estimatedDelivery: "2-4 Business Days",
      status: "SHIPPED",
    };
  },

  getTrackingStatus: async (trackingNumber: string) => {
    return {
      trackingNumber,
      status: "IN_TRANSIT",
      currentLocation: "Regional Sorting Hub",
      estimatedDelivery: "Tomorrow by 5:00 PM",
    };
  },
};
