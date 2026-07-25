import { Product, IProduct } from '../models/Product.js';
import { Category } from '../models/Category.js';
import {
  publishProductCreated,
  publishProductUpdated,
  publishProductDeleted
} from '../events/product.publisher.js';

export interface ProductQueryFilter {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  status?: string;
}

export class ProductService {
  static async getProducts(filter: ProductQueryFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = { status: filter.status || 'ACTIVE' };

    if (filter.category) {
      const cat = await Category.findOne({ $or: [{ _id: filter.category }, { slug: filter.category }] });
      if (cat) {
        query.categoryId = cat._id;
      }
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
    }

    if (filter.search) {
      query.$text = { $search: filter.search };
    }

    let sortOption: any = { createdAt: -1 };
    if (filter.sort === 'price_asc') sortOption = { price: 1 };
    if (filter.sort === 'price_desc') sortOption = { price: -1 };
    if (filter.sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id).populate('categoryId', 'name slug');
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async getProductsByCategory(categoryId: string, page: number = 1, limit: number = 20) {
    return this.getProducts({ category: categoryId, page, limit });
  }

  static async createProduct(vendorId: string, data: Partial<IProduct>) {
    const baseSlug = data.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const product = await Product.create({
      ...data,
      vendorId,
      slug,
      status: 'PENDING_APPROVAL'
    });

    await publishProductCreated({
      productId: product._id.toString(),
      vendorId: product.vendorId,
      name: product.name,
      categoryId: product.categoryId.toString(),
      price: product.price,
      createdAt: product.createdAt
    });

    return product;
  }

  static async updateProduct(id: string, vendorId: string, userRole: string, data: Partial<IProduct>) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (userRole !== 'ADMIN' && product.vendorId !== vendorId) {
      throw new Error('Unauthorized to update this product');
    }

    Object.assign(product, data);
    await product.save();

    await publishProductUpdated({
      productId: product._id.toString(),
      vendorId: product.vendorId,
      name: product.name,
      price: product.price,
      status: product.status,
      updatedAt: product.updatedAt
    });

    return product;
  }

  static async deleteProduct(id: string, vendorId: string, userRole: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (userRole !== 'ADMIN' && product.vendorId !== vendorId) {
      throw new Error('Unauthorized to delete this product');
    }

    await Product.deleteOne({ _id: id });
    await publishProductDeleted(id);

    return { message: 'Product deleted successfully' };
  }

  static async updateProductStatus(id: string, vendorId: string, userRole: string, status: IProduct['status']) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (userRole !== 'ADMIN' && product.vendorId !== vendorId) {
      throw new Error('Unauthorized to update product status');
    }

    product.status = status;
    await product.save();

    await publishProductUpdated({
      productId: product._id.toString(),
      vendorId: product.vendorId,
      name: product.name,
      price: product.price,
      status: product.status,
      updatedAt: product.updatedAt
    });

    return product;
  }

  // ── Admin Approval System ────────────────────────────────────────────────
  static async getPendingProducts(page: number = 1, limit: number = 20) {
    return this.getProducts({ status: 'PENDING_APPROVAL', page, limit });
  }

  static async approveProduct(id: string) {
    return this.updateProductStatus(id, '', 'ADMIN', 'ACTIVE');
  }

  static async rejectProduct(id: string) {
    return this.updateProductStatus(id, '', 'ADMIN', 'REJECTED');
  }
}
