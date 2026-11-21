import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from '../../backend/node_modules/jsonwebtoken/index.js';
import { verifyToken } from '../../backend/shared/src/security/tokenVerification.ts';

const accessSecret = 'dev_access_secret_only_for_local_testing_min_32_chars';
const refreshSecret = 'dev_refresh_secret_only_for_local_testing_min_32_chars';
const claims = {
  id: 'user-1', userId: 'user-1', email: 'user@example.com',
  role: 'CUSTOMER', tokenType: 'access',
};

describe('Backend token verification', () => {
  it('accepts a signed access token only after the revocation endpoint accepts it', async () => {
    const prior = globalThis.fetch;
    let checks = 0;
    globalThis.fetch = async () => {
      checks += 1;
      return Response.json({ valid: true });
    };
    try {
      const token = jwt.sign(claims, accessSecret, { algorithm: 'HS256', expiresIn: '15m' });
      assert.equal((await verifyToken(token)).id, claims.id);
      assert.equal(checks, 1);
    } finally {
      globalThis.fetch = prior;
    }
  });

  it('rejects malformed, expired, tampered, wrong-algorithm and missing-expiration tokens', async () => {
    const valid = jwt.sign(claims, accessSecret, { algorithm: 'HS256', expiresIn: '15m' });
    const [header, , signature] = valid.split('.');
    const tampered = `${header}.${Buffer.from(JSON.stringify({ ...claims, role: 'ADMIN' })).toString('base64url')}.${signature}`;
    const tokens = [
      'malformed',
      jwt.sign(claims, accessSecret, { expiresIn: -1 }),
      tampered,
      jwt.sign(claims, accessSecret, { algorithm: 'HS384', expiresIn: '15m' }),
      jwt.sign(claims, accessSecret),
      jwt.sign({ ...claims, tokenType: 'refresh' }, refreshSecret, { expiresIn: '15m' }),
    ];
    for (const token of tokens) await assert.rejects(verifyToken(token));
  });

  it('rejects revocation and database failures across instances', async () => {
    const prior = globalThis.fetch;
    const token = jwt.sign(claims, accessSecret, { expiresIn: '15m' });
    try {
      globalThis.fetch = async () => Response.json({ valid: false }, { status: 401 });
      await assert.rejects(verifyToken(token), /revoked/);
      globalThis.fetch = async () => { throw new Error('database unavailable'); };
      await assert.rejects(verifyToken(token), /database unavailable/);
    } finally {
      globalThis.fetch = prior;
    }
  });

  it('does not accept refresh tokens as access tokens', async () => {
    const token = jwt.sign({ ...claims, tokenType: 'refresh' }, refreshSecret, { expiresIn: '7d' });
    await assert.rejects(verifyToken(token));
  });
});
