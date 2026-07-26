import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  vendorId: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  price: z.number().nonnegative('Price must be non-negative'),
  quantity: z.number().int().positive('Quantity must be at least 1').optional().default(1),
  imageUrl: z.string().optional()
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().nonnegative('Quantity must be non-negative')
});

export const mergeCartSchema = z.object({
  guestId: z.string().min(1, 'Guest Session ID is required')
});
