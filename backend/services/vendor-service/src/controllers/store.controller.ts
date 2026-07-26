import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service.js';
import { VendorService } from '../services/vendor.service.js';
import { createStoreSchema, updateStoreSchema } from '../validators/vendor.validator.js';

export class StoreController {
  /**
   * Creates a store for the current authenticated vendor user
   */
  static async createStore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createStoreSchema.parse(req.body);
      const userId = req.user!.id;
      
      // Get vendor profile to link vendorId
      const vendor = await VendorService.getVendorProfile(userId);
      const store = await StoreService.createStore(vendor._id.toString(), validated);

      res.status(201).json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets the store details of the current authenticated vendor user
   */
  static async getStore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const vendor = await VendorService.getVendorProfile(userId);
      const store = await StoreService.getStoreByVendorId(vendor._id.toString());
      res.json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates store details of the current authenticated vendor user
   */
  static async updateStore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = updateStoreSchema.parse(req.body);
      const userId = req.user!.id;

      const vendor = await VendorService.getVendorProfile(userId);
      const store = await StoreService.updateStore(vendor._id.toString(), validated);

      res.json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Gets a store's details by its slug (for frontend shop pages)
   */
  static async getStoreBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const store = await StoreService.getStoreBySlug(slug);
      res.json({ success: true, data: store });
    } catch (error) {
      next(error);
    }
  }
}
