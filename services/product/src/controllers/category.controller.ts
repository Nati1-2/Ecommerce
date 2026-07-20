import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await productService.listCategories();
  res.json({ data: categories });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, slug, description, image, parentCategory } = req.body;
  const category = await productService.createCategory({
    name,
    slug,
    description,
    image,
    parentCategory,
  });
  res.status(201).json({ data: category });
};
