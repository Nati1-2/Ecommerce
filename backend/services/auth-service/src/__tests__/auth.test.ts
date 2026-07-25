import request from 'supertest';
import { app } from '../app.js';

describe('Auth Service API Endpoints', () => {
  it('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('Auth Service');
  });

  it('POST /register - should validate registration body', async () => {
    const res = await request(app).post('/register').send({
      name: 'A', // too short
      email: 'invalid-email',
      password: '123'
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /login - should reject invalid credentials format', async () => {
    const res = await request(app).post('/login').send({
      email: 'not-an-email',
      password: ''
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /refresh-token - should fail when refresh token is missing', async () => {
    const res = await request(app).post('/refresh-token').send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
