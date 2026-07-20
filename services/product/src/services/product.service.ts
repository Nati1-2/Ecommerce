import {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  messageBroker,
  EventType,
  createLogger,
} from '@ecom/common';
import { Product, IProduct } from '../models/product.model';
import { Category, ICategory } from '../models/category.model';
import { Review, IReview } from '../models/review.model';
import mongoose from 'mongoose';

const logger = createLogger('product-service');

// ============================================
// Product Query Interfaces
// ============================================

export interface ProductQuery {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  brand?: string;
  sellerId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ============================================
// Product Operations
// ============================================

export const listProducts = async (
  query: ProductQuery
): Promise<PaginatedResult<IProduct>> => {
  const {
    page = 1,
    limit = 20,
    category,
    minPrice,
    maxPrice,
    minRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    brand,
    sellerId,
  } = query;

  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (sellerId) filter.sellerId = sellerId;
  if (minRating) filter.rating = { $gte: minRating };

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortDirection };

  const [data, total] = await Promise.all([
    Product.find(filter).sort(sortOptions).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product');
  }
  return product;
};

export const createProduct = async (
  data: Partial<IProduct>,
  sellerId: string
): Promise<IProduct> => {
  const product = new Product({ ...data, sellerId });
  await product.save();

  // Publish PRODUCT_CREATED event
  await messageBroker.publish({
    type: EventType.PRODUCT_CREATED,
    data: {
      productId: product.id as string,
      name: product.name,
      price: product.price,
      category: product.category,
      sellerId: product.sellerId,
      description: product.description,
      images: product.images,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('Product created', { productId: product.id, sellerId });
  return product;
};

export const updateProduct = async (
  id: string,
  data: Partial<IProduct>,
  userId: string,
  userRole: string
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product');
  }

  // Vendors can only update their own products
  if (userRole === 'VENDOR' && product.sellerId !== userId) {
    throw new NotAuthorizedError();
  }

  // Prevent changing the sellerId
  delete data.sellerId;

  Object.assign(product, data);
  await product.save();

  // Publish PRODUCT_UPDATED event
  await messageBroker.publish({
    type: EventType.PRODUCT_UPDATED,
    data: {
      productId: product.id as string,
      ...data,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('Product updated', { productId: id });
  return product;
};

export const deleteProduct = async (
  id: string,
  userId: string,
  userRole: string
): Promise<void> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product');
  }

  // Vendors can only delete their own products
  if (userRole === 'VENDOR' && product.sellerId !== userId) {
    throw new NotAuthorizedError();
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  // Publish PRODUCT_DELETED event
  await messageBroker.publish({
    type: EventType.PRODUCT_DELETED,
    data: {
      productId: product.id as string,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('Product soft-deleted', { productId: id });
};

// ============================================
// Category Operations
// ============================================

export const listCategories = async (): Promise<ICategory[]> => {
  return Category.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .sort({ name: 1 });
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
}): Promise<ICategory> => {
  if (data.parentCategory) {
    const parent = await Category.findById(data.parentCategory);
    if (!parent) {
      throw new BadRequestError('Parent category not found');
    }
  }

  const category = new Category(data);
  await category.save();

  logger.info('Category created', { categoryId: category.id, name: category.name });
  return category;
};

// ============================================
// Review Operations
// ============================================

export const addReview = async (
  productId: string,
  userId: string,
  data: { rating: number; title?: string; comment?: string }
): Promise<IReview> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('Product');
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    throw new BadRequestError('You have already reviewed this product');
  }

  const review = new Review({
    productId,
    userId,
    ...data,
  });
  await review.save();

  // Recalculate product rating
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const result = stats[0] as { avgRating: number; count: number };
    product.rating = Math.round(result.avgRating * 10) / 10;
    product.ratingsCount = result.count;
    await product.save();
  }

  logger.info('Review added', { productId, userId });
  return review;
};

export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult<IReview>> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  const skip = (page - 1) * limit;
  const filter = { productId: new mongoose.Types.ObjectId(productId) };

  const [data, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
