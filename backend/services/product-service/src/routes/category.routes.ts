import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Public Category Routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.get('/:id/products', CategoryController.getAllCategories);

// Admin Category Management Routes
router.post('/', requireAuth, requireRole(['ADMIN']), CategoryController.createCategory);
router.put('/:id', requireAuth, requireRole(['ADMIN']), CategoryController.updateCategory);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), CategoryController.deleteCategory);

export const categoryRoutes = router;
