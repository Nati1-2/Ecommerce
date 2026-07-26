import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Public Webhook callback endpoint (No JWT Auth)
router.post('/webhook', PaymentController.handleWebhook);

// Protected routes (JWT Auth required)
router.post('/create-intent', authenticateToken, PaymentController.createIntent);
router.get('/order/:orderId', authenticateToken, PaymentController.getPaymentByOrderId);

// Admin / Vendor protected routes
router.post('/:paymentId/refund', authenticateToken, requireRole('admin', 'vendor'), PaymentController.refundPayment);
router.get('/admin/all', authenticateToken, requireRole('admin'), PaymentController.getAllPayments);

export default router;
