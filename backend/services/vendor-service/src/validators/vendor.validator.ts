import { z } from 'zod';

export const registerVendorSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone number must be at least 5 characters'),
  description: z.string().optional()
});

export const updateVendorProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').optional(),
  phone: z.string().min(5, 'Phone number must be at least 5 characters').optional(),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional()
});

export const createStoreSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  banner: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  address: z.string().optional()
});

export const updateStoreSchema = createStoreSchema.partial();

export const adminUpdateVendorStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BLOCKED'], {
    errorMap: () => ({ message: 'Status must be ACTIVE, SUSPENDED, or BLOCKED' })
  })
});
