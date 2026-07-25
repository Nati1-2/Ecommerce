import request from 'supertest';
import { app } from '../app.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

describe('User Service API Endpoints', () => {
  const customerToken = jwt.sign(
    { userId: 'auth_usr_991', email: 'customer@example.com', role: 'CUSTOMER' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const adminToken = jwt.sign(
    { userId: 'admin_usr_001', email: 'admin@example.com', role: 'ADMIN' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  it('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('User Service');
  });

  it('GET /profile - should require authentication', async () => {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /addresses - should validate required address fields', async () => {
    const res = await request(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fullName: 'A' // missing phone, country, city, street, postalCode
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /admin/users - should reject non-admin access', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
