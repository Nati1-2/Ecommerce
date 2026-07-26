import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { parseSession, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Optional session middleware for all cart endpoints
router.use(parseSession);

// Cart endpoints
router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.put('/items/:productId', CartController.updateQuantity);
router.delete('/items/:productId', CartController.removeItem);
router.delete('/', CartController.clearCart);

// Protected merge endpoint
router.post('/merge', requireAuth, CartController.mergeCart);

export default router;
