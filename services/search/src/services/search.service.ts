import { SearchResponse, SearchParams } from 'meilisearch';
import { getProductsIndex, getMeiliClient } from '../config/meilisearch';
import { createLogger } from '@ecom/common';

const logger = createLogger('search-service');

export interface ProductDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  tags: string[];
  images: string[];
  rating: number;
  sellerId: string;
  isActive: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export interface SearchProductsParams {
  q: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  hits: ProductDocument[];
  totalHits: number;
  page: number;
  limit: number;
  totalPages: number;
  processingTimeMs: number;
  query: string;
}

export interface AutocompleteResult {
  suggestions: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

const SORT_MAP: Record<string, string[]> = {
  price_asc: ['price:asc'],
  price_desc: ['price:desc'],
  rating_desc: ['rating:desc'],
  newest: ['createdAt:desc'],
};

class SearchService {
  /**
   * Full-text search products with filtering, sorting, and pagination.
   */
  async searchProducts(params: SearchProductsParams): Promise<SearchResult> {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = params;
    const index = getProductsIndex();

    // Build filter array
    const filters: string[] = ['isActive = true'];

    if (category) {
      filters.push(`category = "${category}"`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      filters.push(`price >= ${minPrice} AND price <= ${maxPrice}`);
    } else if (minPrice !== undefined) {
      filters.push(`price >= ${minPrice}`);
    } else if (maxPrice !== undefined) {
      filters.push(`price <= ${maxPrice}`);
    }

    const searchParams: SearchParams = {
      filter: filters.join(' AND '),
      offset: (page - 1) * limit,
      limit,
      attributesToRetrieve: [
        'id', 'name', 'description', 'price', 'category',
        'brand', 'tags', 'images', 'rating', 'sellerId', 'createdAt',
      ],
    };

    if (sort && SORT_MAP[sort]) {
      searchParams.sort = SORT_MAP[sort];
    }

    const response: SearchResponse<ProductDocument> = await index.search(q, searchParams);

    const totalHits = typeof response.estimatedTotalHits === 'number'
      ? response.estimatedTotalHits
      : 0;

    return {
      hits: response.hits,
      totalHits,
      page,
      limit,
      totalPages: Math.ceil(totalHits / limit),
      processingTimeMs: response.processingTimeMs,
      query: q,
    };
  }

  /**
   * Autocomplete — returns top 5 product name suggestions.
   */
  async autocomplete(query: string): Promise<AutocompleteResult> {
    const index = getProductsIndex();

    const response: SearchResponse<ProductDocument> = await index.search(query, {
      limit: 5,
      attributesToRetrieve: ['id', 'name', 'category'],
      filter: 'isActive = true',
    });

    return {
      suggestions: response.hits.map((hit) => ({
        id: hit.id,
        name: hit.name,
        category: hit.category,
      })),
    };
  }

  /**
   * Add a product document to the Meilisearch index.
   */
  async addProduct(product: ProductDocument): Promise<void> {
    const index = getProductsIndex();
    await index.addDocuments([product]);
    logger.info('Product added to search index', { productId: product.id });
  }

  /**
   * Update an existing product document in the Meilisearch index.
   */
  async updateProduct(product: Partial<ProductDocument> & { id: string }): Promise<void> {
    const index = getProductsIndex();
    await index.updateDocuments([product]);
    logger.info('Product updated in search index', { productId: product.id });
  }

  /**
   * Delete a product document from the Meilisearch index.
   */
  async deleteProduct(productId: string): Promise<void> {
    const index = getProductsIndex();
    await index.deleteDocument(productId);
    logger.info('Product deleted from search index', { productId });
  }

  /**
   * Trigger a full reindex. Deletes all documents and rebuilds from scratch.
   * In a real system, this would call the Product service API to fetch all products.
   * For now, it clears and re-syncs the index settings.
   */
  async reindex(): Promise<{ message: string; enqueuedAt: string }> {
    const index = getProductsIndex();

    // Delete all documents and let event-driven sync rebuild
    const task = await index.deleteAllDocuments();
    logger.info('Full reindex triggered — all documents cleared', { taskUid: task.taskUid });

    return {
      message: 'Reindex started. All documents cleared. Products will be re-synced via events.',
      enqueuedAt: new Date().toISOString(),
    };
  }

  /**
   * Get basic index stats for health/diagnostic purposes.
   */
  async getIndexStats(): Promise<Record<string, unknown>> {
    const meili = getMeiliClient();
    const stats = await meili.index('products').getStats();
    return stats as unknown as Record<string, unknown>;
  }
}

export const searchService = new SearchService();
