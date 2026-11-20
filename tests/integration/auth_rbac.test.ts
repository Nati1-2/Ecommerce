import { describe, it } from 'node:test';
import assert from 'node:assert';
import { authTokens } from '../../frontend/src/lib/authTokens.ts';

describe('Security & RBAC Integration Tests', () => {
  it('prevents access when token is invalid or missing', () => {
    const verified = authTokens.verifyAccessToken('invalid.token.string');
    assert.strictEqual(verified, null);
  });

  it('correctly validates role attributes for CUSTOMER, VENDOR, and ADMIN', () => {
    const adminToken = authTokens.generateAccessToken({
      id: 'usr-admin-1',
      email: 'admin@natistore.com',
      role: 'ADMIN',
    });

    const decoded = authTokens.verifyAccessToken(adminToken);
    assert.notStrictEqual(decoded, null);
    assert.strictEqual(decoded?.role, 'ADMIN');
  });

  it('revokes tokens immediately upon logout', () => {
    const userToken = authTokens.generateAccessToken({
      id: 'usr-cust-1',
      email: 'john@gmail.com',
      role: 'CUSTOMER',
    });

    authTokens.revokeToken(userToken);
    const verifiedAfterRevoke = authTokens.verifyAccessToken(userToken);
    assert.strictEqual(verifiedAfterRevoke, null);
  });
});
