import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
const orderCreationCounter = new Counter('orders_created_total');
const errorRate = new Rate('error_rate');
const catalogResponseTrend = new Trend('catalog_response_time_ms');
const checkoutResponseTrend = new Trend('checkout_response_time_ms');
const adminAnalyticsTrend = new Trend('admin_analytics_time_ms');

// Load Test Configuration (10,000 Concurrent Browsing VUs, 1,000 Checkout VUs)
export const options = {
  scenarios: {
    // 1. Browsing Catalog (10,000 VUs)
    browsing_catalog: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '30s', target: 2000 },
        { duration: '1m', target: 10000 },
        { duration: '30s', target: 0 },
      ],
      gracefulStop: '5s',
    },
    // 2. High-Volume Checkout (1,000 VUs)
    simultaneous_checkouts: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '45s',
      startTime: '10s',
    },
    // 3. Vendor Order Stream Polling (200 VUs)
    vendor_order_polling: {
      executor: 'constant-vus',
      vus: 200,
      duration: '1m',
    },
    // 4. Admin Telemetry & Analytics Scraping (50 VUs)
    admin_analytics_traffic: {
      executor: 'constant-vus',
      vus: 50,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // < 1% error rate
    http_req_duration: ['p(95)<250'], // 95% of requests under 250ms
    error_rate: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export default function () {
  // Group 1: Product Browsing
  group('1. Product Browsing', function () {
    const res = http.get(`${BASE_URL}/api/products`);
    catalogResponseTrend.add(res.timings.duration);
    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    errorRate.add(!passed);
  });

  sleep(0.5);

  // Group 2: High-Volume Checkout
  group('2. Customer Checkout Flow', function () {
    const payload = JSON.stringify({
      items: [
        {
          productId: 'prod-demo-1',
          name: 'Apex Smart Watch Ultra',
          price: 249.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80',
        },
      ],
      shippingAddress: {
        street: '100 High Tech Way',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
      },
      paymentStatus: 'PAID',
      totalAmount: 249.99,
      grandTotal: 249.99,
    });

    const headers = { 'Content-Type': 'application/json' };
    const res = http.post(`${BASE_URL}/api/orders`, payload, { headers });
    checkoutResponseTrend.add(res.timings.duration);

    const passed = check(res, {
      'order status is 201': (r) => r.status === 201,
      'order creation < 300ms': (r) => r.timings.duration < 300,
    });

    if (passed) orderCreationCounter.add(1);
    errorRate.add(!passed);
  });

  sleep(1);

  // Group 3: Vendor Orders Feed
  group('3. Vendor Order Stream', function () {
    const res = http.get(`${BASE_URL}/api/vendor/orders`);
    check(res, {
      'vendor orders status is 200': (r) => r.status === 200,
    });
  });

  // Group 4: Admin Telemetry & Metrics
  group('4. Admin Analytics Scraping', function () {
    const resStats = http.get(`${BASE_URL}/api/admin/stats`);
    const resMetrics = http.get(`${BASE_URL}/api/metrics`);
    adminAnalyticsTrend.add(resStats.timings.duration);

    check(resStats, {
      'admin stats status is 200': (r) => r.status === 200,
    });
    check(resMetrics, {
      'prometheus metrics status is 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}
