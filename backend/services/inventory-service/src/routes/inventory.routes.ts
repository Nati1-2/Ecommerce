import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

// Retrieve specific stock details - Public
router.get('/:productId', InventoryController.getInventory);

// Protected routes (require authenticated session)
router.use(authenticate);

// Low stock items list - Admin & Vendor
router.get('/admin/low-stock', authorize('ADMIN', 'VENDOR'), InventoryController.getLowStock);

// Replenish stock - Admin & Vendor
router.post('/replenish', authorize('ADMIN', 'VENDOR'), InventoryController.replenish);

// Internal/Gateway reservation, release, and deduction endpoints
router.post('/reserve', authorize('ADMIN', 'VENDOR', 'CUSTOMER'), InventoryController.reserve);
router.post('/release', authorize('ADMIN', 'VENDOR', 'CUSTOMER'), InventoryController.release);
router.post('/deduct', authorize('ADMIN', 'VENDOR', 'CUSTOMER'), InventoryController.deduct);

export default router;
