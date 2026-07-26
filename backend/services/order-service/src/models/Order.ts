import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'PENDING' | 'RESERVED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface IOrderItem {
  productId: string;
  vendorId?: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IPricingBreakdown {
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export interface ITrackingInfo {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface IOrder extends Document {
  orderId: string;
  customerId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  pricing: IPricingBreakdown;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  tracking?: ITrackingInfo;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  vendorId: { type: String },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
}, { _id: false });

const PricingBreakdownSchema = new Schema<IPricingBreakdown>({
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0, default: 0 },
  shippingFee: { type: Number, required: true, min: 0, default: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 }
}, { _id: false });

const TrackingInfoSchema = new Schema<ITrackingInfo>({
  carrier: { type: String },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  pricing: { type: PricingBreakdownSchema, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'RESERVED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PAID', 'REFUNDED', 'FAILED'],
    default: 'UNPAID'
  },
  tracking: { type: TrackingInfoSchema },
  cancelReason: { type: String }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
