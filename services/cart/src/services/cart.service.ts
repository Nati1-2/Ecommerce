import { createLogger, NotFoundError, BadRequestError } from '@ecom/common';
import { redisClient } from '../utils/redis';
import axios from 'axios';

const logger = createLogger('cart-service');

const CART_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8003';

// ============================================
// Types
// ============================================

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// ============================================
// Helpers
// ============================================

function cartKey(userId: string): string {
  return `cart:${userId}`;
}

async function getCartData(userId: string): Promise<Cart> {
  const raw = await redisClient.get(cartKey(userId));
  if (!raw) {
    return { items: [], updatedAt: new Date().toISOString() };
  }
  return JSON.parse(raw) as Cart;
}

async function saveCartData(userId: string, cart: Cart): Promise<void> {
  cart.updatedAt = new Date().toISOString();
  await redisClient.set(cartKey(userId), JSON.stringify(cart), 'EX', CART_TTL_SECONDS);
}

async function validateProduct(
  productId: string
): Promise<{ name: string; price: number; image: string }> {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, {
      timeout: 5000,
    });

    const product = response.data?.data;
    if (!product) {
      throw new NotFoundError('Product');
    }

    return {
      name: product.name as string,
      price: product.price as number,
      image: (product.images?.[0] as string) || '',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new NotFoundError('Product');
    }
    logger.error('Failed to validate product with product service', {
      productId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new BadRequestError('Unable to validate product. Product service unavailable.');
  }
}

// ============================================
// Public Service Methods
// ============================================

export async function getCart(userId: string): Promise<Cart> {
  const cart = await getCartData(userId);
  logger.debug('Cart retrieved', { userId, itemCount: cart.items.length });
  return cart;
}

export async function addItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  if (quantity <= 0) {
    throw new BadRequestError('Quantity must be greater than zero');
  }

  // Validate product exists via product service
  const product = await validateProduct(productId);

  const cart = await getCartData(userId);

  // Check if product is already in cart
  const existingIndex = cart.items.findIndex((item) => item.productId === productId);

  if (existingIndex >= 0) {
    cart.items[existingIndex]!.quantity += quantity;
    cart.items[existingIndex]!.name = product.name;
    cart.items[existingIndex]!.price = product.price;
    cart.items[existingIndex]!.image = product.image;
    logger.info('Cart item quantity updated', { userId, productId, newQuantity: cart.items[existingIndex]!.quantity });
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    logger.info('Item added to cart', { userId, productId, quantity });
  }

  await saveCartData(userId, cart);
  return cart;
}

export async function updateItemQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  if (quantity < 0) {
    throw new BadRequestError('Quantity cannot be negative');
  }

  const cart = await getCartData(userId);
  const itemIndex = cart.items.findIndex((item) => item.productId === productId);

  if (itemIndex < 0) {
    throw new NotFoundError('Cart item');
  }

  if (quantity === 0) {
    // Remove item if quantity set to 0
    cart.items.splice(itemIndex, 1);
    logger.info('Cart item removed (quantity set to 0)', { userId, productId });
  } else {
    cart.items[itemIndex]!.quantity = quantity;
    logger.info('Cart item quantity updated', { userId, productId, quantity });
  }

  await saveCartData(userId, cart);
  return cart;
}

export async function removeItem(userId: string, productId: string): Promise<Cart> {
  const cart = await getCartData(userId);
  const itemIndex = cart.items.findIndex((item) => item.productId === productId);

  if (itemIndex < 0) {
    throw new NotFoundError('Cart item');
  }

  cart.items.splice(itemIndex, 1);
  await saveCartData(userId, cart);

  logger.info('Item removed from cart', { userId, productId });
  return cart;
}

export async function clearCart(userId: string): Promise<void> {
  await redisClient.del(cartKey(userId));
  logger.info('Cart cleared', { userId });
}
