export interface ProxyRoute {
  /** The path prefix to match (e.g. '/api/auth') */
  path: string;
  /** Target service URL to proxy to */
  target: string;
  /** Whether to rewrite the path (strip gateway prefix). Default: false */
  pathRewrite?: Record<string, string>;
}

export const proxyRoutes: ProxyRoute[] = [
  {
    path: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:8001',
  },
  {
    path: '/api/users',
    target: process.env.USER_SERVICE_URL || 'http://user-service:8002',
  },
  {
    path: '/api/products',
    target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:8003',
  },
  {
    path: '/api/inventory',
    target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:8004',
  },
  {
    path: '/api/cart',
    target: process.env.CART_SERVICE_URL || 'http://cart-service:8005',
  },
  {
    path: '/api/orders',
    target: process.env.ORDER_SERVICE_URL || 'http://order-service:8006',
  },
  {
    path: '/api/payments',
    target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8007',
  },
  {
    path: '/api/search',
    target: process.env.SEARCH_SERVICE_URL || 'http://search-service:8008',
  },
  {
    path: '/api/notifications',
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:8009',
  },
  {
    path: '/api/recommendations',
    target: process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:8010',
  },
];
