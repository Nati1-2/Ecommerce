import request from 'supertest';
import { app } from '../app.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Vendor } from '../models/Vendor.js';
import { Store } from '../models/Store.js';
import { Commission } from '../models/Commission.js';
import { VendorService } from '../services/vendor.service.js';
import { jest } from '@jest/globals';

describe('Vendor Service API Endpoints & Business Logic', () => {
  const customerToken = jwt.sign(
    { userId: 'cust_001', email: 'customer@example.com', role: 'CUSTOMER' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const vendorToken = jwt.sign(
    { userId: 'vendor_001', email: 'vendor@example.com', role: 'VENDOR' },
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

  // 1. Health check test
  it('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('Vendor Service');
  });

  // 2. Vendor Registration test
  it('POST /api/v1/vendors/register - should register a new vendor', async () => {
    jest.spyOn(Vendor, 'findOne').mockResolvedValue(null);
    jest.spyOn(Vendor, 'create').mockResolvedValue({
      _id: 'vendor_mock_id',
      userId: 'cust_001',
      email: 'customer@example.com',
      businessName: 'My Shop',
      phone: '+123456789',
      verificationStatus: 'PENDING',
      createdAt: new Date()
    } as any);

    const res = await request(app)
      .post('/api/v1/vendors/register')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        businessName: 'My Shop',
        phone: '+123456789',
        description: 'Test seller store description'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.vendorId).toBe('vendor_mock_id');
    expect(res.body.data.status).toBe('PENDING');
  });

  // 3. Vendor Registration validation test
  it('POST /api/v1/vendors/register - should fail registration if fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/vendors/register')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        description: 'Missing businessName and phone'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  // 4. Vendor Profile retrieval test
  it('GET /api/v1/vendors/profile - should fetch vendor profile', async () => {
    jest.spyOn(Vendor, 'findOne').mockResolvedValue({
      _id: 'vendor_mock_id',
      userId: 'vendor_001',
      businessName: 'Existing Shop',
      phone: '+123456789',
      verificationStatus: 'APPROVED'
    } as any);

    const res = await request(app)
      .get('/api/v1/vendors/profile')
      .set('Authorization', `Bearer ${vendorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.businessName).toBe('Existing Shop');
  });

  // 5. Vendor Profile update test
  it('PUT /api/v1/vendors/profile - should update vendor profile fields', async () => {
    const mockSave = jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });

    jest.spyOn(Vendor, 'findOne').mockResolvedValue({
      _id: 'vendor_mock_id',
      userId: 'vendor_001',
      businessName: 'Original Shop',
      phone: '+123',
      save: mockSave
    } as any);

    const res = await request(app)
      .put('/api/v1/vendors/profile')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        businessName: 'Updated Shop Name',
        phone: '+987654321'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.businessName).toBe('Updated Shop Name');
  });

  // 6. Store Creation test
  it('POST /api/v1/vendors/store - should allow approved vendor to create store', async () => {
    jest.spyOn(Vendor, 'findOne').mockResolvedValue({
      _id: 'vendor_mock_id',
      verificationStatus: 'APPROVED'
    } as any);
    jest.spyOn(Vendor, 'findById').mockResolvedValue({
      _id: 'vendor_mock_id',
      verificationStatus: 'APPROVED'
    } as any);
    jest.spyOn(Store, 'findOne').mockResolvedValue(null);
    jest.spyOn(Store, 'create').mockResolvedValue({
      _id: 'store_mock_id',
      vendorId: 'vendor_mock_id',
      storeName: 'Elite Store',
      slug: 'elite-store-1234',
      description: 'Mock store'
    } as any);

    const res = await request(app)
      .post('/api/v1/vendors/store')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        storeName: 'Elite Store',
        description: 'Elite store description'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.storeName).toBe('Elite Store');
    expect(res.body.data.slug).toContain('elite-store');
  });

  // 7. Store Update test
  it('PUT /api/v1/vendors/store - should update store details', async () => {
    const mockSave = jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });

    jest.spyOn(Vendor, 'findOne').mockResolvedValue({
      _id: 'vendor_mock_id'
    } as any);

    jest.spyOn(Store, 'findOne').mockResolvedValue({
      _id: 'store_mock_id',
      vendorId: 'vendor_mock_id',
      storeName: 'Original Store',
      save: mockSave
    } as any);

    const res = await request(app)
      .put('/api/v1/vendors/store')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        description: 'New store description',
        address: '123 New Road'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.description).toBe('New store description');
    expect(res.body.data.address).toBe('123 New Road');
  });

  // 8. Authorization Check test
  it('GET /api/v1/vendors/dashboard - should deny access to customers', async () => {
    const res = await request(app)
      .get('/api/v1/vendors/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // 9. Admin Vendor Approval test
  it('PATCH /api/v1/admin/vendors/:id/approve - should approve vendor application', async () => {
    const mockSave = jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });

    jest.spyOn(Vendor, 'findById').mockResolvedValue({
      _id: 'vendor_mock_id',
      verificationStatus: 'PENDING',
      status: 'ACTIVE',
      save: mockSave
    } as any);

    const res = await request(app)
      .patch('/api/v1/admin/vendors/vendor_mock_id/approve')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Vendor approved successfully');
    expect(res.body.data.verificationStatus).toBe('APPROVED');
  });

  // 10. Commission Calculation helper tests
  describe('Commission Calculations', () => {
    it('calculateCommission() - should calculate correct commission values', () => {
      const commission = VendorService.calculateCommission(100, 10);
      expect(commission).toBe(10);

      const commissionFloat = VendorService.calculateCommission(89.99, 15);
      expect(commissionFloat).toBe(13.5); // 89.99 * 0.15 = 13.4985 => 13.50
    });

    it('createVendorEarning() - should create earning with correct rate', async () => {
      jest.spyOn(Vendor, 'findById').mockResolvedValue({
        _id: 'vendor_mock_id',
        commissionPercentage: 15
      } as any);

      jest.spyOn(Commission, 'create').mockImplementation((data: any) => {
        return Promise.resolve({
          _id: 'comm_id',
          ...data,
          createdAt: new Date()
        }) as any;
      });

      const commissionRecord = await VendorService.createVendorEarning('vendor_mock_id', 'order_999', 200);
      expect(commissionRecord.percentage).toBe(15);
      expect(commissionRecord.amount).toBe(30); // 200 * 15% = 30
      expect(commissionRecord.status).toBe('PENDING');
      expect(commissionRecord.orderId).toBe('order_999');
    });
  });
});
