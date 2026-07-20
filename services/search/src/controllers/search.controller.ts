import { Request, Response } from 'express';
import { searchService, SearchProductsParams } from '../services/search.service';

/**
 * GET /api/search/products
 * Full-text search products with optional filters and sorting.
 */
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    q = '',
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  } = req.query;

  const params: SearchProductsParams = {
    q: String(q),
    category: category ? String(category) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as SearchProductsParams['sort'],
    page: page ? Number(page) : 1,
    limit: limit ? Math.min(Number(limit), 100) : 20,
  };

  const result = await searchService.searchProducts(params);

  res.status(200).json({
    success: true,
    data: result,
  });
};

/**
 * GET /api/search/autocomplete
 * Returns top 5 autocomplete suggestions.
 */
export const autocomplete = async (req: Request, res: Response): Promise<void> => {
  const { q = '' } = req.query;

  const result = await searchService.autocomplete(String(q));

  res.status(200).json({
    success: true,
    data: result,
  });
};

/**
 * POST /api/search/reindex
 * Triggers a full reindex (admin only).
 */
export const reindex = async (_req: Request, res: Response): Promise<void> => {
  const result = await searchService.reindex();

  res.status(200).json({
    success: true,
    data: result,
  });
};
