import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// ── Profile Endpoints (Authenticated) ──────────────────────────────────────
router.get('/profile', requireAuth, UserController.getProfile);
router.put('/profile', requireAuth, UserController.updateProfile);
router.delete('/account', requireAuth, UserController.deleteAccount);

// ── Address Endpoints (Authenticated) ──────────────────────────────────────
router.post('/addresses', requireAuth, UserController.createAddress);
router.get('/addresses', requireAuth, UserController.getAddresses);
router.put('/addresses/:id', requireAuth, UserController.updateAddress);
router.delete('/addresses/:id', requireAuth, UserController.deleteAddress);
router.put('/addresses/:id/default', requireAuth, UserController.setDefaultAddress);

// ── Admin User Management Endpoints (Admin Only) ───────────────────────────
router.get('/admin/users', requireAuth, requireRole(['ADMIN']), UserController.adminGetUsers);
router.get('/admin/users/:id', requireAuth, requireRole(['ADMIN']), UserController.adminGetUserById);
router.put('/admin/users/:id/status', requireAuth, requireRole(['ADMIN']), UserController.adminUpdateUserStatus);
router.delete('/admin/users/:id', requireAuth, requireRole(['ADMIN']), UserController.adminDeleteUser);

export const userRoutes = router;
