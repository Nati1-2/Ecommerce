import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Protect all routes with JWT token auth
router.use(authenticateToken);

// Dashboard routes
router.get('/overview', requireRole('admin', 'vendor'), AnalyticsController.getOverview);
router.get('/vendor', requireRole('vendor', 'admin'), AnalyticsController.getVendorMetrics);
router.get('/revenue-chart', requireRole('admin', 'vendor'), AnalyticsController.getRevenueChart);

// Admin detailed logs route
router.get('/admin/all', requireRole('admin'), AnalyticsController.getAllLogs);

export default router;
