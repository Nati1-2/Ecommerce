import { z } from 'zod';

export const sendDirectNotificationSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  recipientEmail: z.string().email('Invalid email address').optional(),
  type: z.enum([
    'ORDER_CONFIRMATION',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'ORDER_SHIPPED',
    'LOW_STOCK_ALERT',
    'SYSTEM_NOTICE'
  ]).optional().default('SYSTEM_NOTICE'),
  channel: z.enum(['EMAIL', 'IN_APP', 'SMS']).optional().default('IN_APP'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body content is required'),
  metadata: z.record(z.any()).optional()
});
