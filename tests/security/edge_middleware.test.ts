import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from '../../frontend/node_modules/jsonwebtoken/index.js';
import { NextRequest } from '../../frontend/node_modules/next/server.js';
import { middleware } from '../../frontend/src/middleware.ts';

const secret = 'edge_access_secret_for_security_tests_min_32_chars';
const claims = { id: 'user-1', email: 'user@example.com', role: 'CUSTOMER', tokenType: 'access' };

async function responseFor(path: string, token: string) {
  return middleware(new NextRequest(`https://store.example${path}`, {
    headers: { authorization: `Bearer ${token}` },
  }));
}

describe('Edge route authorization', () => {
  it('rejects malformed, expired, tampered, wrong-algorithm and missing-expiration tokens', async () => {
    const previous = process.env.JWT_ACCESS_SECRET;
    process.env.JWT_ACCESS_SECRET = secret;
    try {
      const valid = jwt.sign(claims, secret, { expiresIn: '15m' });
      const [header, , signature] = valid.split('.');
      const tampered = `${header}.${Buffer.from(JSON.stringify({ ...claims, role: 'ADMIN' })).toString('base64url')}.${signature}`;
      const tokens = [
        'malformed', jwt.sign(claims, secret, { expiresIn: -1 }), tampered,
        jwt.sign(claims, secret, { algorithm: 'HS384', expiresIn: '15m' }),
        jwt.sign(claims, secret), jwt.sign({ ...claims, tokenType: 'refresh' }, secret, { expiresIn: '15m' }),
      ];
      for (const token of tokens) {
        const response = await responseFor('/admin/dashboard', token);
        assert.equal(response.status, 307);
        assert.match(response.headers.get('location') || '', /invalid_or_expired_session/);
      }
    } finally {
      if (previous === undefined) delete process.env.JWT_ACCESS_SECRET;
      else process.env.JWT_ACCESS_SECRET = previous;
    }
  });

  it('checks revocation before admitting a token and enforces admin/vendor roles', async () => {
    const previousSecret = process.env.JWT_ACCESS_SECRET;
    const previousFetch = globalThis.fetch;
    process.env.JWT_ACCESS_SECRET = secret;
    let checks = 0;
    try {
      globalThis.fetch = async () => {
        checks += 1;
        return Response.json({ valid: true });
      };
      const customer = jwt.sign(claims, secret, { expiresIn: '15m' });
      assert.match((await responseFor('/admin/dashboard', customer)).headers.get('location') || '', /unauthorized_admin/);
      assert.match((await responseFor('/vendor/dashboard', customer)).headers.get('location') || '', /unauthorized_vendor/);
      assert.equal(checks, 2);
      globalThis.fetch = async () => Response.json({ valid: false }, { status: 401 });
      const admin = jwt.sign({ ...claims, role: 'ADMIN' }, secret, { expiresIn: '15m' });
      assert.match((await responseFor('/admin/dashboard', admin)).headers.get('location') || '', /invalid_or_expired_session/);
    } finally {
      globalThis.fetch = previousFetch;
      if (previousSecret === undefined) delete process.env.JWT_ACCESS_SECRET;
      else process.env.JWT_ACCESS_SECRET = previousSecret;
    }
  });

  it('passes a nonce policy to rendering without inline script or eval permissions', async () => {
    const response = await middleware(new NextRequest('https://store.example/login'));
    const policy = response.headers.get('content-security-policy') || '';
    const forwarded = response.headers.get('x-middleware-request-content-security-policy') || '';
    assert.match(policy, /script-src 'self' 'nonce-[^']+'/);
    assert.equal(forwarded, policy);
    assert.doesNotMatch(policy, /script-src[^;]*unsafe-(inline|eval)/);
    assert.match(policy, /https:\/\/js\.stripe\.com/);
  });
});
