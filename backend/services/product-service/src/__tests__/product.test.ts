import request from 'supertest';
import { app } from '../app.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Product } from '../models/Product.js';
import { jest } from '@jest/globals';

describe('Product Service API Endpoints', () => {
  const customerToken = jwt.sign(
    { userId: 'cust_001', email: 'customer@example.com', role: 'CUSTOMER' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const vendorToken = jwt.sign(
    { userId: 'vendor_771', email: 'vendor@example.com', role: 'VENDOR' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const adminToken = jwt.sign(
    { userId: 'admin_001', email: 'admin@example.com', role: 'ADMIN' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('Product Service');
  });

  it('GET /products - should return product listing format', async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([
        { _id: 'p1', name: 'Sample Product', price: 99.99, status: 'ACTIVE' }
      ] as never)
    };

    jest.spyOn(Product, 'find').mockReturnValue(mockQuery as any);
    jest.spyOn(Product, 'countDocuments').mockResolvedValue(1 as never);

    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toBeDefined();
    expect(res.body.data.pagination).toBeDefined();
  });

  it('POST /products - should reject unauthorized non-vendor users', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Test Product',
        description: 'Testing product authorization rules',
        categoryId: '66a1ef82914b1a0012bc001',
        price: 99.99
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('POST /products - should validate required body fields for vendors', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        name: 'A' // missing description, categoryId, price
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /products/admin/pending - should reject non-admin users', async () => {
    const res = await request(app)
      .get('/products/admin/pending')
      .set('Authorization', `Bearer ${vendorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
