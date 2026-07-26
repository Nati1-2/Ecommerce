import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  vendorId: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  price: z.number().nonnegative('Price must be non-negative'),
  quantity: z.number().int().positive('Quantity must be at least 1')
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required').default('US')
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: shippingAddressSchema,
  tax: z.number().nonnegative().optional().default(0),
  shippingFee: z.number().nonnegative().optional().default(0),
  discount: z.number().nonnegative().optional().default(0)
});

export const updateShippingSchema = z.object({
  carrier: z.string().min(1, 'Carrier is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  estimatedDelivery: z.string().optional()
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required')
});
