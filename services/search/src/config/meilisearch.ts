import { MeiliSearch, Index } from 'meilisearch';
import { createLogger } from '@ecom/common';

const logger = createLogger('search-service');

const PRODUCTS_INDEX = 'products';

const SEARCHABLE_ATTRIBUTES = ['name', 'description', 'category', 'brand', 'tags'];
const FILTERABLE_ATTRIBUTES = ['category', 'price', 'rating', 'sellerId', 'isActive'];
const SORTABLE_ATTRIBUTES = ['price', 'rating', 'createdAt'];

let client: MeiliSearch;

/**
 * Returns the singleton MeiliSearch client instance.
 */
export const getMeiliClient = (): MeiliSearch => {
  if (!client) {
    client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY || '',
    });
  }
  return client;
};

/**
 * Returns the products index handle.
 */
export const getProductsIndex = (): Index => {
  return getMeiliClient().index(PRODUCTS_INDEX);
};

/**
 * Ensures the products index exists and has the correct settings configured.
 * Called once on service startup.
 */
export const configureMeiliSearch = async (): Promise<void> => {
  const meili = getMeiliClient();

  try {
    // Health check
    const health = await meili.health();
    logger.info('Meilisearch is healthy', { status: health.status });

    // Create or get the index
    await meili.createIndex(PRODUCTS_INDEX, { primaryKey: 'id' });
    logger.info(`Index "${PRODUCTS_INDEX}" ensured`);

    const index = meili.index(PRODUCTS_INDEX);

    // Configure searchable attributes
    await index.updateSearchableAttributes(SEARCHABLE_ATTRIBUTES);
    logger.info('Searchable attributes configured', { attributes: SEARCHABLE_ATTRIBUTES });

    // Configure filterable attributes
    await index.updateFilterableAttributes(FILTERABLE_ATTRIBUTES);
    logger.info('Filterable attributes configured', { attributes: FILTERABLE_ATTRIBUTES });

    // Configure sortable attributes
    await index.updateSortableAttributes(SORTABLE_ATTRIBUTES);
    logger.info('Sortable attributes configured', { attributes: SORTABLE_ATTRIBUTES });

    logger.info('Meilisearch fully configured');
  } catch (error) {
    logger.error('Failed to configure Meilisearch', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};
