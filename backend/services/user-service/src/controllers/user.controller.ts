import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  updateStatusSchema
} from '../validators/user.validator.js';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await UserService.getProfile(userId);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = updateProfileSchema.parse(req.body);
      const updatedProfile = await UserService.updateProfile(userId, validatedData as any);
      res.json({ success: true, data: updatedProfile });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await UserService.deleteAccount(userId);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = createAddressSchema.parse(req.body);
      const address = await UserService.createAddress(userId, validatedData as any);
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  static async getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const addresses = await UserService.getUserAddresses(userId);
      res.json({ success: true, data: addresses });
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const validatedData = updateAddressSchema.parse(req.body);
      const updatedAddress = await UserService.updateAddress(userId, id, validatedData as any);
      res.json({ success: true, data: updatedAddress });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const result = await UserService.deleteAddress(userId, id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const address = await UserService.setDefaultAddress(userId, id);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  // ── Admin Controllers ───────────────────────────────────────────────────
  static async adminGetUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await UserService.getAllUsers(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async adminGetUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await UserService.getUserById(id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async adminUpdateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = updateStatusSchema.parse(req.body);
      const result = await UserService.updateUserStatus(id, status);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async adminDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await UserService.deleteUserAdmin(id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
