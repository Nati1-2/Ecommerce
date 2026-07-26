import { z } from 'zod';

export const replenishSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  warehouseLocation: z.string().optional(),
  notes: z.string().optional()
});

export const reserveSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  orderId: z.string().min(1, 'Order ID is required')
});

export const releaseSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  orderId: z.string().min(1, 'Order ID is required')
});

export const deductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  referenceId: z.string().optional()
});
