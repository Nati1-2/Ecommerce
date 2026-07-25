import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
});

export const createAddressSchema = z.object({
  type: z.enum(['HOME', 'WORK']).optional(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(5, 'Phone number is required'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  isDefault: z.boolean().optional()
});

export const updateAddressSchema = createAddressSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'BLOCKED'])
});
