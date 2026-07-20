import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.service';

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const item = await inventoryService.getInventory(productId!);

  res.status(200).json({
    success: true,
    data: item,
  });
};

export const restockProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const performedBy = req.currentUser!.id;

  const item = await inventoryService.restockProduct(productId!, quantity, performedBy);

  res.status(200).json({
    success: true,
    message: `Successfully restocked ${quantity} units`,
    data: item,
  });
};

export const adjustStock = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;
  const performedBy = req.currentUser!.id;

  const item = await inventoryService.adjustStock(productId!, quantity, reason, performedBy);

  res.status(200).json({
    success: true,
    message: 'Stock adjusted successfully',
    data: item,
  });
};

export const getLowStockItems = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.currentUser!.role === 'VENDOR' ? req.currentUser!.id : undefined;

  const items = await inventoryService.getLowStockItems(sellerId);

  res.status(200).json({
    success: true,
    data: items,
    count: items.length,
  });
};

export const getStockMovements = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;

  const result = await inventoryService.getStockMovements(productId!, page, limit);

  res.status(200).json({
    success: true,
    data: result.movements,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit,
    },
  });
};
