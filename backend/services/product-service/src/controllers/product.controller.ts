import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema
} from '../validators/product.validator.js';

export class ProductController {
  // ── Public Handlers ──────────────────────────────────────────────────────
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      const status = req.query.status as string;

      const result = await ProductService.getProducts({
        page,
        limit,
        category,
        minPrice,
        maxPrice,
        search,
        sort,
        status
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await ProductService.getProductById(id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ProductService.getProductsByCategory(id, page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ── Vendor Handlers ──────────────────────────────────────────────────────
  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.user!.id;
      const validatedData = createProductSchema.parse(req.body);
      const product = await ProductService.createProduct(vendorId, validatedData as any);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const vendorId = req.user!.id;
      const userRole = req.user!.role;
      const validatedData = updateProductSchema.parse(req.body);
      const updatedProduct = await ProductService.updateProduct(id, vendorId, userRole, validatedData as any);
      res.json({ success: true, data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const vendorId = req.user!.id;
      const userRole = req.user!.role;
      const result = await ProductService.deleteProduct(id, vendorId, userRole);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async updateProductStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const vendorId = req.user!.id;
      const userRole = req.user!.role;
      const { status } = updateProductStatusSchema.parse(req.body);
      const updatedProduct = await ProductService.updateProductStatus(id, vendorId, userRole, status);
      res.json({ success: true, data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  // ── Admin Approval Handlers ──────────────────────────────────────────────
  static async getPendingProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ProductService.getPendingProducts(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async approveProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const approvedProduct = await ProductService.approveProduct(id);
      res.json({ success: true, message: 'Product approved successfully', data: approvedProduct });
    } catch (error) {
      next(error);
    }
  }

  static async rejectProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const rejectedProduct = await ProductService.rejectProduct(id);
      res.json({ success: true, message: 'Product rejected', data: rejectedProduct });
    } catch (error) {
      next(error);
    }
  }
}
