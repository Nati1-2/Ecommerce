import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category ID is required'),
  price: z.number().positive('Price must be greater than 0'),
  discountPrice: z.number().positive().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().nonnegative().optional(),
  images: z.array(
    z.object({
      url: z.string().url('Invalid image URL'),
      publicId: z.string().optional(),
      isPrimary: z.boolean().optional()
    })
  ).optional(),
  variants: z.array(
    z.object({
      color: z.string().optional(),
      size: z.string().optional(),
      sku: z.string().min(1, 'SKU is required'),
      price: z.number().positive(),
      stock: z.number().nonnegative()
    })
  ).optional()
});

export const updateProductSchema = createProductSchema.partial();

export const updateProductStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'OUT_OF_STOCK'])
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentCategory: z.string().optional()
});

export const updateCategorySchema = createCategorySchema.partial();
