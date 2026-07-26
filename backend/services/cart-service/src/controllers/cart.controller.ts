import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { CartService } from '../services/cart.service.js';
import { addItemSchema, updateQuantitySchema, mergeCartSchema } from '../validators/cart.validator.js';

export class CartController {
  /**
   * Helper to resolve owner ID (userId if logged in, else guestId)
   */
  private static resolveOwnerId(req: AuthRequest): string {
    if (req.user?.id) {
      return req.user.id;
    }
    if (req.guestId) {
      return `guest:${req.guestId}`;
    }
    return `guest:default-anon-session`;
  }

  /**
   * Retrieves cart for current session
   */
  public static async getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = CartController.resolveOwnerId(req);
      const cart = await CartService.getCart(ownerId);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adds an item to the cart
   */
  public static async addItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = CartController.resolveOwnerId(req);
      const validated = addItemSchema.parse(req.body);

      const cart = await CartService.addItem(ownerId, validated);
      res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates item quantity in cart
   */
  public static async updateQuantity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = CartController.resolveOwnerId(req);
      const { productId } = req.params;
      const validated = updateQuantitySchema.parse(req.body);

      const cart = await CartService.updateQuantity(ownerId, productId as string, validated.quantity);
      res.status(200).json({ success: true, message: 'Quantity updated', data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes single product from cart
   */
  public static async removeItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = CartController.resolveOwnerId(req);
      const { productId } = req.params;

      const cart = await CartService.removeItem(ownerId, productId as string);
      res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clears entire cart
   */
  public static async clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = CartController.resolveOwnerId(req);
      const cart = await CartService.clearCart(ownerId);
      res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Merges guest cart into user cart upon login
   */
  public static async mergeCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required to merge cart' });
        return;
      }

      const validated = mergeCartSchema.parse(req.body);
      const guestOwnerId = `guest:${validated.guestId}`;

      const cart = await CartService.mergeCart(req.user.id, guestOwnerId);

      res.status(200).json({
        success: true,
        message: 'Guest cart merged successfully into user cart',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }
}
