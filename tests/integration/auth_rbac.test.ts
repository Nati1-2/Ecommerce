import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from '../../frontend/node_modules/jsonwebtoken/index.js';
import { authTokens } from '../../frontend/src/lib/authTokens.ts';

describe('Security & RBAC Integration Tests', () => {
  const clear = async () => false;
  it('prevents access when token is invalid or missing', async () => {
    const verified = await authTokens.verifyAccessToken('invalid.token.string', clear);
    assert.strictEqual(verified, null);
  });

  it('correctly validates role attributes for CUSTOMER, VENDOR, and ADMIN', async () => {
    const adminToken = authTokens.generateAccessToken({
      id: 'usr-admin-1',
      email: 'admin@natistore.com',
      role: 'ADMIN',
    });

    const decoded = await authTokens.verifyAccessToken(adminToken, clear);
    assert.notStrictEqual(decoded, null);
    assert.strictEqual(decoded?.role, 'ADMIN');
  });

  it('rejects a token revoked by another application instance', async () => {
    const userToken = authTokens.generateAccessToken({
      id: 'usr-cust-1',
      email: 'john@gmail.com',
      role: 'CUSTOMER',
    });

    const sharedRevocationStore = new Set([userToken]);
    const verifiedAfterRevoke = await authTokens.verifyAccessToken(
      userToken, async (token) => sharedRevocationStore.has(token)
    );
    assert.strictEqual(verifiedAfterRevoke, null);
  });

  it('fails closed when the revocation database is unavailable', async () => {
    const token = authTokens.generateAccessToken({
      id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER',
    });
    await assert.rejects(
      authTokens.verifyAccessToken(token, async () => { throw new Error('database unavailable'); }),
      /database unavailable/
    );
  });

  it('rejects expired, malformed, tampered, wrong-algorithm and no-expiry access tokens', async () => {
    const valid = authTokens.generateAccessToken({
      id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER',
    });
    assert.equal((await authTokens.verifyAccessToken(valid, clear))?.id, 'usr-1');
    const [header, payload, signature] = valid.split('.');
    const tampered = `${header}.${Buffer.from(JSON.stringify({ id: 'usr-1', role: 'ADMIN' })).toString('base64url')}.${signature}`;
    const claims = { id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER', tokenType: 'access' };
    const secret = 'dev_access_secret_only_for_local_testing_min_32_chars';
    const expired = jwt.sign(claims, secret, { expiresIn: -1 });
    const noExpiry = jwt.sign(claims, secret);
    const wrongAlgorithm = jwt.sign(claims, secret, { algorithm: 'HS384', expiresIn: '1h' });
    for (const token of [tampered, expired, noExpiry, wrongAlgorithm, 'broken']) {
      assert.equal(await authTokens.verifyAccessToken(token, clear), null);
    }
    assert.ok(payload);
  });

  it('rejects revoked refresh tokens and refresh tokens used as access tokens', async () => {
    const token = authTokens.generateRefreshToken({
      id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER',
    });
    assert.equal(await authTokens.verifyAccessToken(token, clear), null);
    assert.equal((await authTokens.verifyRefreshToken(token, clear))?.id, 'usr-1');
    assert.equal(await authTokens.verifyRefreshToken(token, async () => true), null);
  });

  it('requires separate strong secrets in production', () => {
    const previous = {
      mode: process.env.NODE_ENV,
      access: process.env.JWT_ACCESS_SECRET,
      refresh: process.env.JWT_REFRESH_SECRET,
    };
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_REFRESH_SECRET;
      assert.throws(() => authTokens.generateAccessToken({
        id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER',
      }), /JWT_ACCESS_SECRET/);
      process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
      process.env.JWT_REFRESH_SECRET = 'a'.repeat(32);
      assert.throws(() => authTokens.generateRefreshToken({
        id: 'usr-1', email: 'user@example.com', role: 'CUSTOMER',
      }), /must differ/);
    } finally {
      for (const [key, value] of [
        ['NODE_ENV', previous.mode],
        ['JWT_ACCESS_SECRET', previous.access],
        ['JWT_REFRESH_SECRET', previous.refresh],
      ]) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
