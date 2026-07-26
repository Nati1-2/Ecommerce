import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendor.service.js';
import {
  registerVendorSchema,
  updateVendorProfileSchema,
  adminUpdateVendorStatusSchema
} from '../validators/vendor.validator.js';

export class VendorController {
  /**
   * Registers a new vendor profile
   */
  static async registerVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerVendorSchema.parse(req.body);
      const userId = req.user!.id;
      const email = req.user!.email || '';

      const vendor = await VendorService.registerVendor(userId, email, validated);

      res.status(201).json({
        success: true,
        data: {
          vendorId: vendor._id,
          status: vendor.verificationStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets current vendor's profile details
   */
  static async getVendorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const vendor = await VendorService.getVendorProfile(userId);
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates current vendor's profile details
   */
  static async updateVendorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = updateVendorProfileSchema.parse(req.body);
      const userId = req.user!.id;
      const updatedVendor = await VendorService.updateVendorProfile(userId, validated);
      res.json({ success: true, data: updatedVendor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets vendor dashboard statistics
   */
  static async getVendorDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const vendor = await VendorService.getVendorProfile(userId);
      const stats = await VendorService.getVendorDashboard(vendor._id.toString());
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: List all vendors (with pagination)
   */
  static async listVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await VendorService.listVendors(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: List pending vendor registrations
   */
  static async listPendingVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await VendorService.listPendingVendors(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Approve a vendor application
   */
  static async approveVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.params.id as string;
      const approvedVendor = await VendorService.approveVendor(vendorId);
      res.json({
        success: true,
        message: 'Vendor approved successfully',
        data: approvedVendor
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Reject a vendor application
   */
  static async rejectVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.params.id as string;
      const rejectedVendor = await VendorService.rejectVendor(vendorId);
      res.json({
        success: true,
        message: 'Vendor application rejected',
        data: rejectedVendor
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update vendor status (ACTIVE, SUSPENDED, BLOCKED)
   */
  static async updateVendorStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.params.id as string;
      const { status } = adminUpdateVendorStatusSchema.parse(req.body);
      const updatedVendor = await VendorService.updateVendorStatus(vendorId, status);
      res.json({
        success: true,
        message: 'Vendor status updated successfully',
        data: updatedVendor
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public/Internal: Get vendor details by Id (for validation)
   */
  static async getVendorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.params.id as string;
      const vendor = await VendorService.getVendorById(vendorId);
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  }
}
