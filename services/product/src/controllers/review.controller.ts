import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const addReview = async (req: Request, res: Response): Promise<void> => {
  const { rating, title, comment } = req.body;
  const review = await productService.addReview(
    req.params.id,
    req.currentUser!.id,
    { rating, title, comment }
  );
  res.status(201).json({ data: review });
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10' } = req.query;
  const result = await productService.getProductReviews(
    req.params.id,
    parseInt(page as string, 10),
    Math.min(parseInt(limit as string, 10), 50)
  );
  res.json(result);
};
