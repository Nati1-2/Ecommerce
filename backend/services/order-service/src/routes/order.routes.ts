import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Protect all order routes with JWT auth
router.use(authenticateToken);

// Customer / General endpoints
router.post('/', OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);

// Vendor endpoints
router.get('/vendor-orders', requireRole('vendor', 'admin'), OrderController.getVendorOrders);
router.put('/:id/ship', requireRole('vendor', 'admin'), OrderController.shipOrder);

// Admin endpoints
router.get('/admin/all', requireRole('admin'), OrderController.getAllOrders);

// Individual order management
router.get('/:id', OrderController.getOrderById);
router.put('/:id/cancel', OrderController.cancelOrder);

export default router;
