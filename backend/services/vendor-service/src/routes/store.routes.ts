import { Router } from 'express';
import { StoreController } from '../controllers/store.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// ── Public Store Endpoints ──
router.get('/slug/:slug', StoreController.getStoreBySlug);

// ── Protected Vendor Store Endpoints ──
router.post('/', requireAuth, StoreController.createStore);
router.get('/', requireAuth, StoreController.getStore);
router.put('/', requireAuth, StoreController.updateStore);

export const storeRoutes = router;
