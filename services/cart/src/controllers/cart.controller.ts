import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const cart = await cartService.getCart(userId);

  res.status(200).json({
    success: true,
    data: cart,
  });
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const { productId, quantity } = req.body;

  const cart = await cartService.addItem(userId, productId, quantity);

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart,
  });
};

export const updateItemQuantity = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await cartService.updateItemQuantity(userId, productId!, quantity);

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: cart,
  });
};

export const removeItem = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  const { productId } = req.params;

  const cart = await cartService.removeItem(userId, productId!);

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart,
  });
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.currentUser!.id;
  await cartService.clearCart(userId);

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
  });
};
