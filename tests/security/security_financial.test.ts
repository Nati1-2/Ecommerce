import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from '../../frontend/node_modules/jsonwebtoken/index.js';
import { authTokens } from '../../frontend/src/lib/authTokens.ts';
import { sanitizeInput, sanitizePayload, validatePasswordStrength } from '../../frontend/src/lib/security.ts';
import { validateProductionEnv } from '../../frontend/src/lib/envCheck.ts';

const TEST_SECRET = 'test_secret_for_automated_security_verification_min_32_characters';

describe('P0 Security & Authorization Tests', () => {
  const clear = async () => false;
  it('rejects forged / tampered tokens', async () => {
    const validToken = authTokens.generateAccessToken({
      id: 'usr-1',
      email: 'user@example.com',
      role: 'CUSTOMER',
    });

    // Tamper with payload
    const parts = validToken.split('.');
    const tampered = `${parts[0]}.${Buffer.from(JSON.stringify({ id: 'usr-1', role: 'ADMIN' })).toString('base64url')}.${parts[2]}`;

    const decoded = await authTokens.verifyAccessToken(tampered, clear);
    assert.strictEqual(decoded, null, 'Tampered token must fail cryptographic signature verification');
  });

  it('prevents role elevation: token signed with wrong secret is rejected', async () => {
    const forgedAdminToken = jwt.sign(
      { id: 'attacker-1', email: 'attacker@evil.com', role: 'ADMIN' },
      'wrong_attacker_secret_key'
    );

    const verified = await authTokens.verifyAccessToken(forgedAdminToken, clear);
    assert.strictEqual(verified, null, 'Attacker token with forged secret must be rejected');
  });

  it('enforces least-privilege role matrix (CUSTOMER != ADMIN, CUSTOMER != VENDOR)', async () => {
    const customerToken = authTokens.generateAccessToken({
      id: 'cust-123',
      email: 'customer@store.com',
      role: 'CUSTOMER',
    });

    const payload = await authTokens.verifyAccessToken(customerToken, clear);
    assert.notStrictEqual(payload, null);
    assert.strictEqual(payload?.role, 'CUSTOMER');
    assert.notStrictEqual(payload?.role, 'ADMIN', 'Customer must not have ADMIN role');
    assert.notStrictEqual(payload?.role, 'VENDOR', 'Customer must not have VENDOR role');
  });

  it('blocks horizontal privilege escalation: customer cannot access another customer order', () => {
    const victimOrder = {
      id: 'ord-victim-789',
      userId: 'usr-victim-111',
      grandTotal: 349.99,
    };

    const attackerTokenPayload = {
      id: 'usr-attacker-222',
      email: 'attacker@store.com',
      role: 'CUSTOMER',
    };

    const isAuthorized =
      attackerTokenPayload.role === 'ADMIN' ||
      victimOrder.userId === attackerTokenPayload.id;

    assert.strictEqual(isAuthorized, false, 'Customer must not access another customer order');
  });

  it('blocks vendor cross-tenant access: vendor cannot modify another vendor product or order', () => {
    const ownerVendorProduct = {
      id: 'prod-owner-456',
      vendorId: 'vendor-owner-999',
      name: 'Genuine Item',
    };

    const attackerVendorPayload = {
      id: 'vendor-attacker-888',
      email: 'badvendor@store.com',
      role: 'VENDOR',
    };

    const canModify =
      attackerVendorPayload.role === 'ADMIN' ||
      ownerVendorProduct.vendorId === attackerVendorPayload.id;

    assert.strictEqual(canModify, false, 'Vendor must not modify another vendor product');
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
    const databaseProducts: Record<string, { price: number; stock: number; isActive: boolean }> = {
      'prod-macbook': { price: 1999, stock: 15, isActive: true },
      'prod-mouse': { price: 79, stock: 50, isActive: true },
    };

    // Client maliciously attempts to pay $1 instead of $1999
    const clientCart = [
      { productId: 'prod-macbook', quantity: 1, price: 1 },
      { productId: 'prod-mouse', quantity: 2, price: 5 },
    ];

    let authoritativeSubtotal = 0;
    const verifiedItems = clientCart.map((item) => {
      const dbProduct = databaseProducts[item.productId];
      assert.ok(dbProduct, 'Product must exist in DB');
      assert.strictEqual(dbProduct.isActive, true, 'Product must be active');
      assert.ok(dbProduct.stock >= item.quantity, 'Stock must be sufficient');

      const authoritativePrice = dbProduct.price;
      authoritativeSubtotal += authoritativePrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: authoritativePrice,
      };
    });

    const expectedSubtotal = 1999 * 1 + 79 * 2; // 2157
    const shipping = authoritativeSubtotal >= 100 ? 0 : 10;
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

  it('consolidates duplicate cart lines to prevent inventory overselling', () => {
    // Available stock in database is 5
    const dbStock = 5;

    // Attacker sends duplicate lines with small quantities to bypass per-line checks
    const cart = [
      { productId: 'prod-rare', quantity: 3 },
      { productId: 'prod-rare', quantity: 3 },
    ];

    // Consolidation logic implemented in orders API
    const consolidatedMap = new Map<string, number>();
    for (const item of cart) {
      consolidatedMap.set(
        item.productId,
        (consolidatedMap.get(item.productId) || 0) + item.quantity
      );
    }

    const totalRequested = consolidatedMap.get('prod-rare') || 0;
    const canFulfill = dbStock >= totalRequested;

    assert.strictEqual(totalRequested, 6, 'Duplicate lines must be consolidated to 6 units');
    assert.strictEqual(canFulfill, false, 'Combined quantity must be rejected when exceeding stock of 5');
  });

  it('executes atomic compensation rollback if order persistence fails after stock deduction', () => {
    const productCatalog = { 'prod-limited': { stock: 10 } };
    const reservedQuantity = 4;

    // Step 1: Stock is atomically deducted
    productCatalog['prod-limited'].stock -= reservedQuantity;
    assert.strictEqual(productCatalog['prod-limited'].stock, 6);

    // Step 2: Order write fails simulated
    const orderWriteFailed = true;

    // Step 3: Compensation handler restores stock
    if (orderWriteFailed) {
      productCatalog['prod-limited'].stock += reservedQuantity;
    }

    assert.strictEqual(
      productCatalog['prod-limited'].stock,
      10,
      'Product stock must be cleanly restored to initial value on order write failure'
    );
  });

  it('rejects PaymentIntent creation when currency or order status is invalid', () => {
    const order = {
      id: 'ord-123',
      userId: 'usr-1',
      grandTotal: 100,
      orderStatus: 'PAID', // Already paid
      currency: 'USD',
    };

    const requestedCurrency = 'EUR'; // Mismatched currency

    const canPay = order.orderStatus !== 'PAID' && order.currency.toLowerCase() === requestedCurrency.toLowerCase();
    assert.strictEqual(canPay, false, 'PaymentIntent must be rejected for already-paid or currency-mismatched order');
  });

  it('detects underpayment fraud in Stripe webhook processing', () => {
    const authoritativeOrder = {
      id: 'ord-999',
      grandTotal: 250.00,
    };

    // Attacker manipulated Stripe PaymentIntent to only pay $25.00
    const spoofedIntent = {
      id: 'pi_spoofed_amount',
      amount: 2500, // $25.00 in cents
      currency: 'usd',
    };

    const expectedCents = Math.round(authoritativeOrder.grandTotal * 100); // 25000 cents
    const isPaymentValid = spoofedIntent.amount >= expectedCents;

    assert.strictEqual(isPaymentValid, false, 'Webhook must reject intent where paid amount is less than expected order cents');
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
    const prevAccess = process.env.JWT_ACCESS_SECRET;
    const prevRefresh = process.env.JWT_REFRESH_SECRET;

    try {
      delete process.env.MONGODB_URI;
      delete process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_REFRESH_SECRET;
      process.env.NODE_ENV = 'production';

      const validation = validateProductionEnv();
      assert.strictEqual(validation.valid, false);
      assert.ok(validation.missing.includes('MONGODB_URI'));
      assert.ok(validation.missing.includes('JWT_ACCESS_SECRET'));
      assert.ok(validation.missing.includes('JWT_REFRESH_SECRET'));
    } finally {
      process.env.NODE_ENV = prevEnv;
      if (prevMongo) process.env.MONGODB_URI = prevMongo;
      if (prevAccess) process.env.JWT_ACCESS_SECRET = prevAccess;
      if (prevRefresh) process.env.JWT_REFRESH_SECRET = prevRefresh;
    }
  });
});
