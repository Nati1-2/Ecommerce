import { getRedisClient } from '../config/redis.js';
import { ICart, ICartItem } from '../models/cart.model.js';
import { logger } from '../utils/logger.js';

const CART_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export class CartService {
  /**
   * Helper to format Redis key
   */
  private static getCartKey(ownerId: string): string {
    return `cart:${ownerId}`;
  }

  /**
   * Recalculates cart total items and total amount
   */
  private static calculateCartTotals(ownerId: string, items: ICartItem[]): ICart {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      ownerId,
      items,
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Fetches cart by owner ID
   */
  public static async getCart(ownerId: string): Promise<ICart> {
    const client = getRedisClient();
    const key = this.getCartKey(ownerId);
    const data = await client.get(key);

    if (!data) {
      return this.calculateCartTotals(ownerId, []);
    }

    try {
      return JSON.parse(data) as ICart;
    } catch {
      return this.calculateCartTotals(ownerId, []);
    }
  }

  /**
   * Saves cart object back to Redis with TTL
   */
  private static async saveCart(cart: ICart): Promise<void> {
    const client = getRedisClient();
    const key = this.getCartKey(cart.ownerId);
    await client.set(key, JSON.stringify(cart));
    await client.expire(key, CART_TTL_SECONDS);
  }

  /**
   * Adds an item to the cart or increments existing quantity
   */
  public static async addItem(
    ownerId: string,
    itemData: {
      productId: string;
      vendorId?: string;
      productName: string;
      price: number;
      quantity?: number;
      imageUrl?: string;
    }
  ): Promise<ICart> {
    const cart = await this.getCart(ownerId);
    const addQty = itemData.quantity && itemData.quantity > 0 ? itemData.quantity : 1;

    const existingIndex = cart.items.findIndex((i) => i.productId === itemData.productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += addQty;
      cart.items[existingIndex].subtotal = cart.items[existingIndex].price * cart.items[existingIndex].quantity;
    } else {
      cart.items.push({
        productId: itemData.productId,
        vendorId: itemData.vendorId,
        productName: itemData.productName,
        price: itemData.price,
        quantity: addQty,
        imageUrl: itemData.imageUrl,
        subtotal: itemData.price * addQty
      });
    }

    const updatedCart = this.calculateCartTotals(ownerId, cart.items);
    await this.saveCart(updatedCart);

    logger.info(`Item ${itemData.productId} added to cart for owner: ${ownerId}`);
    return updatedCart;
  }

  /**
   * Updates item quantity directly
   */
  public static async updateQuantity(ownerId: string, productId: string, newQuantity: number): Promise<ICart> {
    const cart = await this.getCart(ownerId);

    if (newQuantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      const item = cart.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = newQuantity;
        item.subtotal = item.price * newQuantity;
      }
    }

    const updatedCart = this.calculateCartTotals(ownerId, cart.items);
    await this.saveCart(updatedCart);

    logger.info(`Updated quantity for ${productId} to ${newQuantity} for owner: ${ownerId}`);
    return updatedCart;
  }

  /**
   * Removes single product from cart
   */
  public static async removeItem(ownerId: string, productId: string): Promise<ICart> {
    const cart = await this.getCart(ownerId);
    cart.items = cart.items.filter((i) => i.productId !== productId);

    const updatedCart = this.calculateCartTotals(ownerId, cart.items);
    await this.saveCart(updatedCart);

    logger.info(`Removed product ${productId} from cart for owner: ${ownerId}`);
    return updatedCart;
  }

  /**
   * Clears cart entirely
   */
  public static async clearCart(ownerId: string): Promise<ICart> {
    const client = getRedisClient();
    const key = this.getCartKey(ownerId);
    await client.del(key);

    logger.info(`Cleared cart for owner: ${ownerId}`);
    return this.calculateCartTotals(ownerId, []);
  }

  /**
   * Merges guest cart items into authenticated user cart
   */
  public static async mergeCart(userId: string, guestId: string): Promise<ICart> {
    const guestCart = await this.getCart(guestId);
    if (!guestCart.items.length) {
      return this.getCart(userId);
    }

    const userCart = await this.getCart(userId);

    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find((i) => i.productId === guestItem.productId);
      if (existing) {
        existing.quantity += guestItem.quantity;
        existing.subtotal = existing.price * existing.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    const mergedCart = this.calculateCartTotals(userId, userCart.items);
    await this.saveCart(mergedCart);

    // Delete guest cart after successful merge
    await this.clearCart(guestId);

    logger.info(`Merged guest cart (${guestId}) into user cart (${userId})`);
    return mergedCart;
  }
}
