import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// ── Public Routes ──────────────────────────────────────────────────────────
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// ── Vendor Protected Routes ────────────────────────────────────────────────
router.post('/', requireAuth, requireRole(['VENDOR', 'ADMIN']), ProductController.createProduct);
router.put('/:id', requireAuth, requireRole(['VENDOR', 'ADMIN']), ProductController.updateProduct);
router.delete('/:id', requireAuth, requireRole(['VENDOR', 'ADMIN']), ProductController.deleteProduct);
router.patch('/:id/status', requireAuth, requireRole(['VENDOR', 'ADMIN']), ProductController.updateProductStatus);

// ── Admin Approval Routes ──────────────────────────────────────────────────
router.get('/admin/pending', requireAuth, requireRole(['ADMIN']), ProductController.getPendingProducts);
router.patch('/admin/:id/approve', requireAuth, requireRole(['ADMIN']), ProductController.approveProduct);
router.patch('/admin/:id/reject', requireAuth, requireRole(['ADMIN']), ProductController.rejectProduct);

export const productRoutes = router;
