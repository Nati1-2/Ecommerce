import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Protect all routes with JWT token auth
router.use(authenticateToken);

// User notification endpoints
router.get('/my-notifications', NotificationController.getMyNotifications);
router.put('/:id/read', NotificationController.markAsRead);

// Admin endpoints
router.post('/send-direct', requireRole('admin'), NotificationController.sendDirect);
router.get('/admin/all', requireRole('admin'), NotificationController.getAllNotifications);

export default router;
