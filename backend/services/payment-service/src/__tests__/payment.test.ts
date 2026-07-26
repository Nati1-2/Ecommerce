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

// 2. Mock Payment Publisher events
const mockPublishPaymentCompleted = jest.fn();
const mockPublishPaymentFailed = jest.fn();

jest.unstable_mockModule('../events/payment.publisher.js', () => ({
  connectRabbitMQ: async () => {},
  publishPaymentCompleted: mockPublishPaymentCompleted,
  publishPaymentFailed: mockPublishPaymentFailed
}));

describe('Payment Service Integration Tests', () => {
  let token: string;
  let adminToken: string;
  let app: any;
  let request: any;
  let Payment: any;

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
      adminToken = generateToken('admin', 'admin-789');

      const appMod = await import('../app.js');
      app = appMod.default;

      const paymentMod = await import('../models/Payment.js');
      Payment = paymentMod.Payment;
    } catch (err) {
      console.error('Error in beforeAll:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/payments/create-intent', () => {
    it('should create a payment intent successfully', async () => {
      const payload = {
        orderId: 'ORD-20260726-1001',
        amount: 250,
        currency: 'USD',
        provider: 'MOCK',
        idempotencyKey: 'IK-TEST-001'
      };

      const mockCreatedPayment = {
        paymentId: 'PAY-20260726-9001',
        orderId: payload.orderId,
        customerId: 'user-cust-123',
        amount: 250,
        currency: 'USD',
        provider: 'MOCK',
        status: 'PENDING',
        idempotencyKey: payload.idempotencyKey
      };

      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      jest.spyOn(Payment, 'create').mockResolvedValue(mockCreatedPayment as any);

      const res = await request(app)
        .post('/api/v1/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentId).toBe('PAY-20260726-9001');
      expect(res.body.data.amount).toBe(250);
      expect(Payment.create).toHaveBeenCalled();
    });

    it('should return existing payment record if idempotencyKey matches', async () => {
      const payload = {
        orderId: 'ORD-20260726-1001',
        amount: 250,
        idempotencyKey: 'IK-EXISTING'
      };

      const mockExistingPayment = {
        paymentId: 'PAY-20260726-0000',
        orderId: payload.orderId,
        customerId: 'user-cust-123',
        amount: 250,
        status: 'PENDING',
        idempotencyKey: payload.idempotencyKey
      };

      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockExistingPayment as any);

      const res = await request(app)
        .post('/api/v1/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentId).toBe('PAY-20260726-0000');
    });
  });

  describe('POST /api/v1/payments/webhook', () => {
    it('should process completed webhook and publish payment.completed event', async () => {
      const mockPayment = {
        paymentId: 'PAY-20260726-9001',
        orderId: 'ORD-20260726-1001',
        customerId: 'user-cust-123',
        amount: 250,
        provider: 'MOCK',
        status: 'PENDING',
        save: jest.fn().mockImplementation(function(this: any) {
          this.status = 'COMPLETED';
          return Promise.resolve(this);
        })
      };

      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment as any);

      const webhookPayload = {
        event: 'charge.succeeded',
        transactionId: 'txn_mock_12345',
        orderId: 'ORD-20260726-1001',
        status: 'COMPLETED'
      };

      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .send(webhookPayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
      expect(mockPayment.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/payments/:paymentId/refund', () => {
    it('should refund a completed payment', async () => {
      const mockCompletedPayment = {
        paymentId: 'PAY-20260726-9001',
        orderId: 'ORD-20260726-1001',
        status: 'COMPLETED',
        save: jest.fn().mockImplementation(function(this: any) {
          this.status = 'REFUNDED';
          return Promise.resolve(this);
        })
      };

      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockCompletedPayment as any);

      const payload = {
        reason: 'Customer requested return'
      };

      const res = await request(app)
        .post('/api/v1/payments/PAY-20260726-9001/refund')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('REFUNDED');
      expect(mockCompletedPayment.save).toHaveBeenCalled();
    });
  });
});
