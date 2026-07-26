import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller.js';
import { storeRoutes } from './store.routes.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

// ── Vendor / Store Router ──
const vendorRouter = Router();

// Mount store routes
vendorRouter.use('/store', storeRoutes);

// Vendor core endpoints
vendorRouter.post('/register', requireAuth, VendorController.registerVendor);
vendorRouter.get('/profile', requireAuth, VendorController.getVendorProfile);
vendorRouter.put('/profile', requireAuth, VendorController.updateVendorProfile);
vendorRouter.get('/dashboard', requireAuth, requireRole(['VENDOR', 'ADMIN']), VendorController.getVendorDashboard);

// Validation / details endpoint
vendorRouter.get('/:id', VendorController.getVendorById);

// ── Admin Moderation Router ──
const adminRouter = Router();

adminRouter.get('/', requireAuth, requireRole(['ADMIN']), VendorController.listVendors);
adminRouter.get('/pending', requireAuth, requireRole(['ADMIN']), VendorController.listPendingVendors);
adminRouter.patch('/:id/approve', requireAuth, requireRole(['ADMIN']), VendorController.approveVendor);
adminRouter.patch('/:id/reject', requireAuth, requireRole(['ADMIN']), VendorController.rejectVendor);
adminRouter.patch('/:id/status', requireAuth, requireRole(['ADMIN']), VendorController.updateVendorStatus);

export const vendorRoutes = vendorRouter;
export const adminVendorRoutes = adminRouter;
