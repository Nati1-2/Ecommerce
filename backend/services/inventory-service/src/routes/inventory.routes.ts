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
router.get('/admin/low-stock', authorize('admin', 'vendor'), InventoryController.getLowStock);

// Replenish stock - Admin & Vendor
router.post('/replenish', authorize('admin', 'vendor'), InventoryController.replenish);

// Internal/Gateway reservation, release, and deduction endpoints
router.post('/reserve', authorize('admin', 'vendor', 'customer'), InventoryController.reserve);
router.post('/release', authorize('admin', 'vendor', 'customer'), InventoryController.release);
router.post('/deduct', authorize('admin', 'vendor', 'customer'), InventoryController.deduct);

export default router;
