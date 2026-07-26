import { jest } from '@jest/globals';

describe('Cart Service Integration Tests', () => {
  let token: string;
  let app: any;
  let request: any;

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

      const appMod = await import('../app.js');
      app = appMod.default;
    } catch (err) {
      console.error('Error in beforeAll:', err);
      throw err;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/cart', () => {
    it('should return default empty cart for a new session', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('x-guest-id', 'guest-test-111')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(0);
      expect(res.body.data.totalAmount).toBe(0);
    });
  });

  describe('POST /api/v1/cart/items', () => {
    it('should add an item to the cart and calculate subtotals correctly', async () => {
      const itemPayload = {
        productId: 'prod-laptop-1',
        vendorId: 'vendor-10',
        productName: 'Gaming Laptop',
        price: 1500,
        quantity: 2,
        imageUrl: 'https://example.com/laptop.jpg'
      };

      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${token}`)
        .send(itemPayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalItems).toBe(2);
      expect(res.body.data.totalAmount).toBe(3000);
      expect(res.body.data.items[0].productId).toBe('prod-laptop-1');
    });
  });

  describe('PUT /api/v1/cart/items/:productId', () => {
    it('should update item quantity', async () => {
      const updatePayload = {
        quantity: 5
      };

      const res = await request(app)
        .put('/api/v1/cart/items/prod-laptop-1')
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalItems).toBe(5);
      expect(res.body.data.totalAmount).toBe(7500);
    });
  });

  describe('DELETE /api/v1/cart/items/:productId', () => {
    it('should remove product from cart', async () => {
      const res = await request(app)
        .delete('/api/v1/cart/items/prod-laptop-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(0);
      expect(res.body.data.totalAmount).toBe(0);
    });
  });

  describe('POST /api/v1/cart/merge', () => {
    it('should merge guest cart items into authenticated user cart', async () => {
      const guestId = 'guest-session-999';

      // 1. Add item to guest cart
      await request(app)
        .post('/api/v1/cart/items')
        .set('x-guest-id', guestId)
        .send({
          productId: 'prod-mouse-2',
          productName: 'Wireless Mouse',
          price: 25,
          quantity: 2
        })
        .expect(200);

      // 2. Merge guest cart into user cart
      const res = await request(app)
        .post('/api/v1/cart/merge')
        .set('Authorization', `Bearer ${token}`)
        .send({ guestId })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].productId).toBe('prod-mouse-2');
      expect(res.body.data.totalAmount).toBe(50);
    });
  });

  describe('DELETE /api/v1/cart', () => {
    it('should clear entire cart', async () => {
      const res = await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(0);
    });
  });
});
