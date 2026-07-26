import { jest } from '@jest/globals';

// 1. Mock ioredis package BEFORE any imports that use ioredis
jest.unstable_mockModule('ioredis', () => {
  const mockRedisInstance = {
    ping: async () => 'PONG',
    set: async () => 'OK',
    del: async () => 1,
    on: jest.fn((event: string, cb: Function) => {
      if (event === 'connect') cb();
    }),
    quit: async () => 'OK'
  };
  return {
    default: jest.fn().mockImplementation(() => mockRedisInstance),
    Redis: jest.fn().mockImplementation(() => mockRedisInstance)
  };
});

// 2. Mock amqplib package
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

// Mock RabbitMQ publisher functions
const mockPublishInventoryReserved = jest.fn();
const mockPublishInventoryLowStock = jest.fn();
jest.unstable_mockModule('../events/inventory.publisher.js', () => ({
  connectRabbitMQ: async () => {},
  publishInventoryReserved: mockPublishInventoryReserved,
  publishInventoryLowStock: mockPublishInventoryLowStock
}));

describe('Inventory Service Integration Tests', () => {
  const testProductId = 'prod-test-999';
  let token: string;
  let adminToken: string;
  let generateToken: (role?: string, id?: string) => string;
  let app: any;
  let request: any;
  let InventoryItem: any;
  let StockMovement: any;

  beforeAll(async () => {
    try {
      const redisMod = await import('../config/redis.js');
      redisMod.setRedisClient({
        ping: async () => 'PONG',
        set: async () => 'OK',
        del: async () => 1,
        on: (event: string, cb: Function) => {
          if (event === 'connect') cb();
        },
        quit: async () => 'OK'
      });

      const supertestMod = await import('supertest');
      request = supertestMod.default;

      const jwtMod = await import('jsonwebtoken');
      const jwt = jwtMod.default;

      const envMod = await import('../config/env.js');
      const env = envMod.env;

      generateToken = (role = 'vendor', id = 'user-123') => {
        return jwt.sign({ id, email: 'test@example.com', role }, env.JWT_SECRET);
      };

      token = generateToken('vendor');
      adminToken = generateToken('admin');

      // Dynamically import to ensure mock module registry is active
      const appMod = await import('../app.js');
      app = appMod.default;

      const itemMod = await import('../models/InventoryItem.js');
      InventoryItem = itemMod.InventoryItem;

      const movementMod = await import('../models/StockMovement.js');
      StockMovement = movementMod.StockMovement;
    } catch (err) {
      console.error('CRITICAL ERROR IN BEFOREALL:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/inventory/:productId', () => {
    it('should lazily create and return inventory if it does not exist', async () => {
      // Mock findOne to return null (does not exist)
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(null);
      // Mock create to return a default object
      const mockCreatedItem = {
        productId: testProductId,
        totalStock: 0,
        reservedStock: 0,
        availableStock: 0,
        lowStockThreshold: 5,
        save: jest.fn().mockImplementation(function(this: any) { return Promise.resolve(this); })
      };
      jest.spyOn(InventoryItem, 'create').mockResolvedValue(mockCreatedItem as any);

      const res = await request(app)
        .get(`/api/v1/inventory/${testProductId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.productId).toBe(testProductId);
      expect(res.body.data.totalStock).toBe(0);
      expect(res.body.data.reservedStock).toBe(0);
      expect(res.body.data.availableStock).toBe(0);
      expect(InventoryItem.findOne).toHaveBeenCalledWith({ productId: testProductId });
      expect(InventoryItem.create).toHaveBeenCalled();
    });

    it('should return existing inventory details if they exist', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 100,
        reservedStock: 15,
        availableStock: 85,
        lowStockThreshold: 5,
        save: jest.fn().mockImplementation(function(this: any) { return Promise.resolve(this); })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);

      const res = await request(app)
        .get(`/api/v1/inventory/${testProductId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.productId).toBe(testProductId);
      expect(res.body.data.totalStock).toBe(100);
      expect(res.body.data.reservedStock).toBe(15);
      expect(res.body.data.availableStock).toBe(85);
    });
  });

  describe('POST /api/v1/inventory/replenish', () => {
    it('should replenish stock level and create movement audit log', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 10,
        reservedStock: 0,
        availableStock: 10,
        lowStockThreshold: 5,
        save: jest.fn().mockImplementation(function(this: any) {
          return Promise.resolve(this);
        })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);
      jest.spyOn(StockMovement, 'create').mockResolvedValue({} as any);

      const payload = {
        productId: testProductId,
        quantity: 50,
        warehouseLocation: 'WH-A1',
        notes: 'Initial restock'
      };

      const res = await request(app)
        .post('/api/v1/inventory/replenish')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalStock).toBe(60); // 10 + 50
      expect(res.body.data.warehouseLocation).toBe('WH-A1');
      expect(StockMovement.create).toHaveBeenCalled();
    });

    it('should fail if user is not authorized (customer role)', async () => {
      const customerToken = generateToken('customer');
      const payload = {
        productId: testProductId,
        quantity: 50
      };

      await request(app)
        .post('/api/v1/inventory/replenish')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(payload)
        .expect(430); // Role Forbidden
    });
  });

  describe('POST /api/v1/inventory/reserve', () => {
    it('should reserve stock for checkout successfully', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 10,
        reservedStock: 0,
        availableStock: 10,
        lowStockThreshold: 2,
        save: jest.fn().mockImplementation(function(this: any) {
          this.reservedStock += 4;
          this.availableStock -= 4;
          return Promise.resolve(this);
        })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);
      jest.spyOn(StockMovement, 'create').mockResolvedValue({} as any);

      const payload = {
        orderId: 'order-111',
        items: [{ productId: testProductId, quantity: 4 }]
      };

      const res = await request(app)
        .post('/api/v1/inventory/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockItem.save).toHaveBeenCalled();
      expect(StockMovement.create).toHaveBeenCalled();
    });

    it('should fail to reserve if stock is insufficient', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 10,
        reservedStock: 0,
        availableStock: 10,
        lowStockThreshold: 2,
        save: jest.fn().mockImplementation(function(this: any) { return Promise.resolve(this); })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);
      jest.spyOn(StockMovement, 'create').mockResolvedValue({} as any);

      const payload = {
        orderId: 'order-111',
        items: [{ productId: testProductId, quantity: 15 }] // Exceeds 10 available
      };

      const res = await request(app)
        .post('/api/v1/inventory/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(500); // Insufficient stock throws error

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Insufficient stock');
    });
  });

  describe('POST /api/v1/inventory/release', () => {
    it('should release reserved stock successfully', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 10,
        reservedStock: 5,
        availableStock: 5,
        save: jest.fn().mockImplementation(function(this: any) {
          this.reservedStock -= 3;
          this.availableStock += 3;
          return Promise.resolve(this);
        })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);
      jest.spyOn(StockMovement, 'create').mockResolvedValue({} as any);

      const payload = {
        orderId: 'order-111',
        items: [{ productId: testProductId, quantity: 3 }]
      };

      const res = await request(app)
        .post('/api/v1/inventory/release')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockItem.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/inventory/deduct', () => {
    it('should deduct stock permanently', async () => {
      const mockItem = {
        productId: testProductId,
        totalStock: 10,
        reservedStock: 4,
        availableStock: 6,
        lowStockThreshold: 1,
        save: jest.fn().mockImplementation(function(this: any) {
          this.totalStock -= 4;
          this.reservedStock -= 4;
          this.availableStock = this.totalStock - this.reservedStock;
          return Promise.resolve(this);
        })
      };
      jest.spyOn(InventoryItem, 'findOne').mockResolvedValue(mockItem as any);
      jest.spyOn(StockMovement, 'create').mockResolvedValue({} as any);

      const payload = {
        orderId: 'order-111',
        items: [{ productId: testProductId, quantity: 4 }]
      };

      const res = await request(app)
        .post('/api/v1/inventory/deduct')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockItem.save).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/inventory/admin/low-stock', () => {
    it('should list items that are below the low stock threshold', async () => {
      const mockItems = [
        { productId: 'prod-low', totalStock: 4, reservedStock: 1, availableStock: 3, lowStockThreshold: 5 }
      ];
      jest.spyOn(InventoryItem, 'find').mockResolvedValue(mockItems as any);

      const res = await request(app)
        .get('/api/v1/inventory/admin/low-stock')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].productId).toBe('prod-low');
    });
  });
});
