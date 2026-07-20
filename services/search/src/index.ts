import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { createLogger, messageBroker, EventType, BaseEvent } from '@ecom/common';
import { configureMeiliSearch } from './config/meilisearch';
import { searchService, ProductDocument } from './services/search.service';

const logger = createLogger('search-service');
const PORT = parseInt(process.env.SEARCH_SERVICE_PORT || '8008', 10);

const setupEventSubscriptions = async (): Promise<void> => {
  // PRODUCT_CREATED — add new product to search index
  await messageBroker.subscribe(
    'search_product_created',
    EventType.PRODUCT_CREATED,
    async (event: BaseEvent) => {
      const data = event.data as {
        productId: string;
        name: string;
        price: number;
        category: string;
        sellerId: string;
        description: string;
        images: string[];
        brand?: string;
        tags?: string[];
        rating?: number;
        isActive?: boolean;
        createdAt?: string;
      };

      const product: ProductDocument = {
        id: data.productId,
        name: data.name,
        description: data.description || '',
        price: data.price,
        category: data.category,
        brand: data.brand || '',
        tags: data.tags || [],
        images: data.images || [],
        rating: data.rating || 0,
        sellerId: data.sellerId,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      await searchService.addProduct(product);
      logger.info('Handled PRODUCT_CREATED event', { productId: data.productId });
    }
  );

  // PRODUCT_UPDATED — update existing product in search index
  await messageBroker.subscribe(
    'search_product_updated',
    EventType.PRODUCT_UPDATED,
    async (event: BaseEvent) => {
      const data = event.data as { productId: string; [key: string]: unknown };

      const updatePayload: Partial<ProductDocument> & { id: string } = {
        id: data.productId,
      };

      // Map all provided fields to the update payload
      const fieldsToCopy = [
        'name', 'description', 'price', 'category', 'brand',
        'tags', 'images', 'rating', 'sellerId', 'isActive', 'createdAt',
      ] as const;

      for (const field of fieldsToCopy) {
        if (data[field] !== undefined) {
          (updatePayload as Record<string, unknown>)[field] = data[field];
        }
      }

      await searchService.updateProduct(updatePayload);
      logger.info('Handled PRODUCT_UPDATED event', { productId: data.productId });
    }
  );

  // PRODUCT_DELETED — remove product from search index
  await messageBroker.subscribe(
    'search_product_deleted',
    EventType.PRODUCT_DELETED,
    async (event: BaseEvent) => {
      const data = event.data as { productId: string };
      await searchService.deleteProduct(data.productId);
      logger.info('Handled PRODUCT_DELETED event', { productId: data.productId });
    }
  );
};

const start = async (): Promise<void> => {
  try {
    // Configure Meilisearch index settings
    await configureMeiliSearch();
    logger.info('Meilisearch configured successfully');

    // Connect to RabbitMQ
    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    // Set up event subscriptions
    await setupEventSubscriptions();
    logger.info('Event subscriptions established');

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Search service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start search service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down search service...');
  await messageBroker.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
