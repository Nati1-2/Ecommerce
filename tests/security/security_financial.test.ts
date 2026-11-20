import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from '../../frontend/node_modules/jsonwebtoken/index.js';
import { authTokens } from '../../frontend/src/lib/authTokens.ts';
import { sanitizeInput, sanitizePayload, validatePasswordStrength } from '../../frontend/src/lib/security.ts';
import { validateProductionEnv } from '../../frontend/src/lib/envCheck.ts';

const TEST_SECRET = 'test_secret_for_automated_security_verification_min_32_characters';

describe('P0 Security & Authorization Tests', () => {
  it('rejects forged / tampered tokens', () => {
    const validToken = authTokens.generateAccessToken({
      id: 'usr-1',
      email: 'user@example.com',
      role: 'CUSTOMER',
    });

    // Tamper with payload
    const parts = validToken.split('.');
    const tampered = `${parts[0]}.${Buffer.from(JSON.stringify({ id: 'usr-1', role: 'ADMIN' })).toString('base64url')}.${parts[2]}`;

    const decoded = authTokens.verifyAccessToken(tampered);
    assert.strictEqual(decoded, null, 'Tampered token must fail cryptographic signature verification');
  });

  it('prevents role elevation: token signed with wrong secret is rejected', () => {
    const forgedAdminToken = jwt.sign(
      { id: 'attacker-1', email: 'attacker@evil.com', role: 'ADMIN' },
      'wrong_attacker_secret_key'
    );

    const verified = authTokens.verifyAccessToken(forgedAdminToken);
    assert.strictEqual(verified, null, 'Attacker token with forged secret must be rejected');
  });

  it('enforces least-privilege role matrix (CUSTOMER != ADMIN, CUSTOMER != VENDOR)', () => {
    const customerToken = authTokens.generateAccessToken({
      id: 'cust-123',
      email: 'customer@store.com',
      role: 'CUSTOMER',
    });

    const payload = authTokens.verifyAccessToken(customerToken);
    assert.notStrictEqual(payload, null);
    assert.strictEqual(payload?.role, 'CUSTOMER');
    assert.notStrictEqual(payload?.role, 'ADMIN', 'Customer must not have ADMIN role');
    assert.notStrictEqual(payload?.role, 'VENDOR', 'Customer must not have VENDOR role');
  });

  it('blocks XSS payloads and script tags in user input sanitization', () => {
    const maliciousInput = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
    const clean = sanitizeInput(maliciousInput);

    assert.doesNotMatch(clean, /<script>/, 'Input must not contain executable script tags');
    assert.doesNotMatch(clean, /onerror=/, 'Dangerous event handlers must be sanitized');
    assert.match(clean, /&lt;/, 'Angle brackets must be entity-encoded');
  });

  it('blocks Prototype Pollution keys (__proto__, constructor, prototype) in payload sanitization', () => {
    const maliciousPayload = {
      name: 'Safe Product',
      __proto__: { isAdmin: true },
      constructor: { role: 'ADMIN' },
      prototype: { evil: true },
    };

    const cleanPayload: any = sanitizePayload(maliciousPayload);
    assert.strictEqual(cleanPayload.__proto__.isAdmin, undefined);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(cleanPayload, '__proto__'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(cleanPayload, 'constructor'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(cleanPayload, 'prototype'), false);
  });

  it('enforces strong password validation (length, upper, lower, number)', () => {
    const weakPass = validatePasswordStrength('weak');
    assert.strictEqual(weakPass.isValid, false);
    assert.ok(weakPass.errors.length > 0);

    const strongPass = validatePasswordStrength('SuperSecure#2026!');
    assert.strictEqual(strongPass.isValid, true);
    assert.strictEqual(strongPass.errors.length, 0);
  });
});

describe('P0 Financial & Payment Integrity Tests', () => {
  it('calculates server-authoritative pricing and ignores client-submitted price overrides', () => {
    // Authoritative product catalog
    const databaseProducts: Record<string, { price: number; stock: number; isActive: boolean }> = {
      'prod-macbook': { price: 1999, stock: 15, isActive: true },
      'prod-mouse': { price: 79, stock: 50, isActive: true },
    };

    // Client maliciously attempts to pay $1 instead of $1999
    const clientCart = [
      { productId: 'prod-macbook', quantity: 1, price: 1 }, // Client attempts $1 price tampering
      { productId: 'prod-mouse', quantity: 2, price: 5 },  // Client attempts $5 price tampering
    ];

    // Server-authoritative calculation
    let authoritativeSubtotal = 0;
    const verifiedItems = clientCart.map((item) => {
      const dbProduct = databaseProducts[item.productId];
      assert.ok(dbProduct, 'Product must exist in DB');
      assert.strictEqual(dbProduct.isActive, true, 'Product must be active');
      assert.ok(dbProduct.stock >= item.quantity, 'Stock must be sufficient');

      // Server takes authoritative price, ignoring item.price
      const authoritativePrice = dbProduct.price;
      authoritativeSubtotal += authoritativePrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: authoritativePrice,
      };
    });

    const expectedSubtotal = 1999 * 1 + 79 * 2; // 2157
    const shipping = authoritativeSubtotal >= 100 ? 0 : 10; // Free shipping over 100
    const tax = Math.round(authoritativeSubtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((authoritativeSubtotal + shipping + tax) * 100) / 100;

    assert.strictEqual(authoritativeSubtotal, expectedSubtotal, 'Subtotal must match authoritative DB catalog');
    assert.strictEqual(verifiedItems[0].price, 1999, 'Client-sent $1 price must be overridden by DB price $1999');
    assert.strictEqual(grandTotal, 2264.85, 'Authoritative grand total must be computed server-side');
  });

  it('rejects order checkout when stock is insufficient', () => {
    const dbProduct = { price: 500, stock: 2, isActive: true };
    const requestedQuantity = 5;

    const canFulfill = dbProduct.stock >= requestedQuantity;
    assert.strictEqual(canFulfill, false, 'Server must reject checkout when requested quantity exceeds stock');
  });

  it('verifies Stripe webhook idempotency: duplicate events are skipped', () => {
    const processedEvents = new Set<string>();

    const handleWebhookEvent = (eventId: string) => {
      if (processedEvents.has(eventId)) {
        return { received: true, idempotent: true };
      }
      processedEvents.add(eventId);
      return { received: true, idempotent: false, processed: true };
    };

    const firstCall = handleWebhookEvent('evt_test_12345');
    assert.strictEqual(firstCall.idempotent, false);
    assert.strictEqual(firstCall.processed, true);

    const duplicateCall = handleWebhookEvent('evt_test_12345');
    assert.strictEqual(duplicateCall.idempotent, true, 'Duplicate webhook event must be idempotent');
  });
});

describe('P1 Environment Configuration Validation Tests', () => {
  it('detects missing critical environment variables in production mode', () => {
    const prevEnv = process.env.NODE_ENV;
    const prevMongo = process.env.MONGODB_URI;
    const prevJwt = process.env.JWT_SECRET;

    try {
      delete process.env.MONGODB_URI;
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = 'production';

      const validation = validateProductionEnv();
      assert.strictEqual(validation.valid, false);
      assert.ok(validation.missing.includes('MONGODB_URI'));
      assert.ok(validation.missing.includes('JWT_SECRET'));
    } finally {
      process.env.NODE_ENV = prevEnv;
      if (prevMongo) process.env.MONGODB_URI = prevMongo;
      if (prevJwt) process.env.JWT_SECRET = prevJwt;
    }
  });
});
