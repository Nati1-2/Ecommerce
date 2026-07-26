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

describe('Notification Service Integration Tests', () => {
  let token: string;
  let adminToken: string;
  let app: any;
  let request: any;
  let Notification: any;

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

      const notifMod = await import('../models/Notification.js');
      Notification = notifMod.Notification;
    } catch (err) {
      console.error('Error in beforeAll:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/notifications/my-notifications', () => {
    it('should fetch in-app notifications for authenticated user', async () => {
      const mockNotifications = [
        {
          notificationId: 'NOTIF-1',
          recipientId: 'user-cust-123',
          type: 'ORDER_CONFIRMATION',
          subject: 'Order Placed',
          body: 'Your order was received',
          isRead: false
        }
      ];

      const mockQuery = {
        sort: jest.fn().mockImplementation(() => Promise.resolve(mockNotifications))
      };
      jest.spyOn(Notification, 'find').mockReturnValue(mockQuery as any);

      const res = await request(app)
        .get('/api/v1/notifications/my-notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(Notification.find).toHaveBeenCalledWith({ recipientId: 'user-cust-123' });
    });
  });

  describe('PUT /api/v1/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const mockNotif = {
        notificationId: 'NOTIF-1',
        recipientId: 'user-cust-123',
        isRead: false,
        save: jest.fn().mockImplementation(function(this: any) {
          this.isRead = true;
          return Promise.resolve(this);
        })
      };

      jest.spyOn(Notification, 'findOne').mockResolvedValue(mockNotif as any);

      const res = await request(app)
        .put('/api/v1/notifications/NOTIF-1/read')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.isRead).toBe(true);
      expect(mockNotif.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/notifications/send-direct', () => {
    it('should allow admin to send a direct notification', async () => {
      const payload = {
        recipientId: 'user-cust-123',
        subject: 'System Maintenance Notice',
        body: 'Scheduled maintenance tonight at 2 AM EST.'
      };

      const mockCreatedNotif = {
        notificationId: 'NOTIF-2',
        ...payload,
        type: 'SYSTEM_NOTICE',
        channel: 'IN_APP',
        status: 'SENT',
        isRead: false
      };

      jest.spyOn(Notification, 'create').mockResolvedValue(mockCreatedNotif as any);

      const res = await request(app)
        .post('/api/v1/notifications/send-direct')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe('System Maintenance Notice');
      expect(Notification.create).toHaveBeenCalled();
    });
  });
});
