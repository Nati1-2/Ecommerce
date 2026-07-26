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

// 2. Mock Order Publisher events
const mockPublishOrderCreated = jest.fn();
const mockPublishOrderCancelled = jest.fn();
const mockPublishOrderStatusUpdated = jest.fn();

jest.unstable_mockModule('../events/order.publisher.js', () => ({
  connectRabbitMQ: async () => {},
  publishOrderCreated: mockPublishOrderCreated,
  publishOrderCancelled: mockPublishOrderCancelled,
  publishOrderStatusUpdated: mockPublishOrderStatusUpdated
}));

describe('Order Service Integration Tests', () => {
  let token: string;
  let vendorToken: string;
  let adminToken: string;
  let app: any;
  let request: any;
  let Order: any;

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

      const orderMod = await import('../models/Order.js');
      Order = orderMod.Order;
    } catch (err) {
      console.error('Error in beforeAll:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/orders', () => {
    it('should create a new order and calculate total price correctly', async () => {
      const payload = {
        items: [
          { productId: 'prod-1', vendorId: 'vendor-456', productName: 'Laptop', price: 1000, quantity: 2 },
          { productId: 'prod-2', vendorId: 'vendor-456', productName: 'Mouse', price: 50, quantity: 1 }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          phone: '123-456-7890',
          street: '123 Main St',
          city: 'Techville',
          state: 'CA',
          zipCode: '90210',
          country: 'US'
        },
        tax: 50,
        shippingFee: 15,
        discount: 20
      };

      const mockCreatedOrder = {
        orderId: 'ORD-20260726-1001',
        customerId: 'user-cust-123',
        items: [
          { productId: 'prod-1', vendorId: 'vendor-456', productName: 'Laptop', price: 1000, quantity: 2, subtotal: 2000 },
          { productId: 'prod-2', vendorId: 'vendor-456', productName: 'Mouse', price: 50, quantity: 1, subtotal: 50 }
        ],
        shippingAddress: payload.shippingAddress,
        pricing: {
          subtotal: 2050,
          tax: 50,
          shippingFee: 15,
          discount: 20,
          total: 2095
        },
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(Order, 'create').mockResolvedValue(mockCreatedOrder as any);

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.orderId).toBe('ORD-20260726-1001');
      expect(res.body.data.pricing.total).toBe(2095);
      expect(Order.create).toHaveBeenCalled();
    });

    it('should reject order creation if items list is empty', async () => {
      const payload = {
        items: [],
        shippingAddress: {
          fullName: 'John Doe',
          phone: '123-456-7890',
          street: '123 Main St',
          city: 'Techville',
          state: 'CA',
          zipCode: '90210',
          country: 'US'
        }
      };

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/orders/my-orders', () => {
    it('should fetch orders placed by authenticated customer', async () => {
      const mockOrders = [
        { orderId: 'ORD-1', customerId: 'user-cust-123', status: 'PAID' }
      ];

      const mockQuery = {
        sort: jest.fn().mockImplementation(() => Promise.resolve(mockOrders))
      };
      jest.spyOn(Order, 'find').mockReturnValue(mockQuery as any);

      const res = await request(app)
        .get('/api/v1/orders/my-orders')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(Order.find).toHaveBeenCalledWith({ customerId: 'user-cust-123' });
    });
  });

  describe('GET /api/v1/orders/vendor-orders', () => {
    it('should fetch orders for vendor', async () => {
      const mockOrders = [
        { orderId: 'ORD-1', items: [{ vendorId: 'vendor-456' }], status: 'PAID' }
      ];

      const mockQuery = {
        sort: jest.fn().mockImplementation(() => Promise.resolve(mockOrders))
      };
      jest.spyOn(Order, 'find').mockReturnValue(mockQuery as any);

      const res = await request(app)
        .get('/api/v1/orders/vendor-orders')
        .set('Authorization', `Bearer ${vendorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(Order.find).toHaveBeenCalledWith({ 'items.vendorId': 'vendor-456' });
    });
  });

  describe('PUT /api/v1/orders/:id/ship', () => {
    it('should update tracking and set status to SHIPPED', async () => {
      const mockOrder = {
        orderId: 'ORD-100',
        status: 'PAID',
        tracking: undefined,
        save: jest.fn().mockImplementation(function(this: any) {
          this.status = 'SHIPPED';
          return Promise.resolve(this);
        })
      };

      jest.spyOn(Order, 'findOne').mockResolvedValue(mockOrder as any);

      const payload = {
        carrier: 'FedEx',
        trackingNumber: 'FEX-9988776655'
      };

      const res = await request(app)
        .put('/api/v1/orders/ORD-100/ship')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SHIPPED');
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });

  describe('PUT /api/v1/orders/:id/cancel', () => {
    it('should cancel order successfully and publish order.cancelled event', async () => {
      const mockOrder = {
        orderId: 'ORD-100',
        customerId: 'user-cust-123',
        status: 'PENDING',
        items: [{ productId: 'prod-1', quantity: 2 }],
        save: jest.fn().mockImplementation(function(this: any) {
          this.status = 'CANCELLED';
          return Promise.resolve(this);
        })
      };

      jest.spyOn(Order, 'findOne').mockResolvedValue(mockOrder as any);

      const payload = {
        reason: 'Changed my mind'
      };

      const res = await request(app)
        .put('/api/v1/orders/ORD-100/cancel')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CANCELLED');
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
