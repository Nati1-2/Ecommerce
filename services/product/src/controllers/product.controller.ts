import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const listProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    page = '1',
    limit = '20',
    category,
    minPrice,
    maxPrice,
    minRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    brand,
    sellerId,
  } = req.query;

  const result = await productService.listProducts({
    page: parseInt(page as string, 10),
    limit: Math.min(parseInt(limit as string, 10), 100),
    category: category as string | undefined,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    minRating: minRating ? parseFloat(minRating as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    search: search as string | undefined,
    brand: brand as string | undefined,
    sellerId: sellerId as string | undefined,
  });

  res.json(result);
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.getProductById(req.params.id);
  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    subcategory,
    images,
    variants,
    tags,
    brand,
    sku,
    weight,
    dimensions,
    stock,
  } = req.body;

  const product = await productService.createProduct(
    {
      name,
      description,
      price,
      compareAtPrice,
      category,
      subcategory,
      images,
      variants,
      tags,
      brand,
      sku,
      weight,
      dimensions,
      stock,
    },
    req.currentUser!.id
  );

  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.currentUser!.id,
    req.currentUser!.role
  );
  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  await productService.deleteProduct(
    req.params.id,
    req.currentUser!.id,
    req.currentUser!.role
  );
  res.status(204).send();
};
