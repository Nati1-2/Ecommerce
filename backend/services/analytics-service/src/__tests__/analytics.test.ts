import { jest } from '@jest/globals';

// 1. Mock amqplib package BEFORE any imports
jest.unstable_mockModule('amqplib', () => {
  const mockChannel = {
    assertExchange: async () => {},
    assertQueue: async () => ({ queue: 'test_queue' }),
    bindQueue: async () => {},
    consume: async () => {},
    publish: async () => true,
    ack: jest.fn(),
    nack: jest.fn()
  };
  const mockConnection = {
    createChannel: async () => mockChannel,
    close: async () => {}
  };
  return {
    default: {
      connect: async () => mockConnection
    }
  };
});

describe('Analytics Service Integration Tests', () => {
  let token: string;
  let vendorToken: string;
  let adminToken: string;
  let app: any;
  let request: any;
  let DailyAnalytics: any;
  let VendorAnalytics: any;

  beforeAll(async () => {
    try {
      const supertestMod = await import('supertest');
      request = supertestMod.default;

      const jwtMod = await import('jsonwebtoken');
      const jwt = jwtMod.default;

      const envMod = await import('../config/env.js');
      const env = envMod.env;

      const generateToken = (role = 'customer', id = 'user-cust-123') => {
        return jwt.sign({ id, email: 'customer@example.com', role }, env.JWT_SECRET);
      };

      token = generateToken('customer', 'user-cust-123');
      vendorToken = generateToken('vendor', 'vendor-456');
      adminToken = generateToken('admin', 'admin-789');

      const appMod = await import('../app.js');
      app = appMod.default;

      const dailyMod = await import('../models/DailyAnalytics.js');
      DailyAnalytics = dailyMod.DailyAnalytics;

      const vendorMod = await import('../models/VendorAnalytics.js');
      VendorAnalytics = vendorMod.VendorAnalytics;
    } catch (err) {
      console.error('Error in beforeAll:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/analytics/overview', () => {
    it('should return aggregated platform high-level metrics', async () => {
      const mockAggregateResult = [
        {
          totalRevenue: 5000,
          totalOrders: 10,
          successfulPayments: 8,
          failedPayments: 2,
          itemsSold: 15
        }
      ];

      jest.spyOn(DailyAnalytics, 'aggregate').mockResolvedValue(mockAggregateResult as any);

      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalRevenue).toBe(5000);
      expect(res.body.data.totalOrders).toBe(10);
      expect(res.body.data.conversionRate).toBe(80);
    });
  });

  describe('GET /api/v1/analytics/vendor', () => {
    it('should return vendor performance metrics for authenticated vendor', async () => {
      const mockVendorData = {
        vendorId: 'vendor-456',
        totalSales: 12,
        totalRevenue: 1200,
        lowStockCount: 1
      };

      jest.spyOn(VendorAnalytics, 'findOne').mockResolvedValue(mockVendorData as any);

      const res = await request(app)
        .get('/api/v1/analytics/vendor')
        .set('Authorization', `Bearer ${vendorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.vendorId).toBe('vendor-456');
      expect(res.body.data.totalRevenue).toBe(1200);
    });
  });

  describe('GET /api/v1/analytics/revenue-chart', () => {
    it('should return time-series revenue chart data', async () => {
      const mockDailyLogs = [
        { date: '2026-07-26', totalRevenue: 1000, totalOrders: 3 },
        { date: '2026-07-25', totalRevenue: 850, totalOrders: 2 }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockImplementation(() => Promise.resolve(mockDailyLogs))
        })
      };

      jest.spyOn(DailyAnalytics, 'find').mockReturnValue(mockQuery as any);

      const res = await request(app)
        .get('/api/v1/analytics/revenue-chart?days=7')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].date).toBe('2026-07-26');
    });
  });
});
