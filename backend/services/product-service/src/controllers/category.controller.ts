import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.js';
import { createCategorySchema, updateCategorySchema } from '../validators/product.validator.js';

export class CategoryController {
  static async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const category = await CategoryService.getCategoryById(id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await CategoryService.createCategory(validatedData as any);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await CategoryService.updateCategory(id, validatedData as any);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await CategoryService.deleteCategory(id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
