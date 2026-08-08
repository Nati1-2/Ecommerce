export type EnterpriseEventType =
  | "OrderCreated"
  | "PaymentCompleted"
  | "PaymentFailed"
  | "InventoryReserved"
  | "OrderShipped"
  | "OrderCancelled";

export interface EnterpriseEventPayload<T = any> {
  eventId: string;
  eventType: EnterpriseEventType;
  aggregateId: string;
  data: T;
  timestamp: string;
}
