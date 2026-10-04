# 🧪 Testing Strategy & Quality Assurance Framework — Nati Platform

This document defines the testing pyramid, quality assurance rules, automated test execution steps, and Playwright E2E specifications for the **Nati.** E-Commerce Platform.

---

## 📐 The Testing Pyramid

```text
                       ┌───────────────────────┐
                       │  Playwright E2E Tests │  <-- Critical user flows
                       └───────────┬───────────┘
                                   │
                       ┌───────────┴───────────┐
                       │   Integration Tests   │  <-- Auth RBAC & API routes
                       └───────────┬───────────┘
                                   │
                       ┌───────────┴───────────┐
                       │   Unit Test Coverage  │  <-- Order math & helpers
                       └───────────────────────┘
```

---

## 🛠️ Validation & Test Execution Commands

Run these standard commands from the repository root to validate code quality:

```bash
# 1. TypeScript Type Checker (increases Node heap size to prevent OOM)
NODE_OPTIONS="--max-old-space-size=4096" npx tsc --noEmit --project frontend/tsconfig.json

# 2. ESLint Validation
npm run lint --prefix frontend

# 3. Execute Unit & Integration Tests (Jest / Vitest)
npm test

# 4. Execute Playwright E2E Automation
npx playwright test
```

---

## 📄 Test Suite Directory Layout

```text
tests/
├── unit/                       # Pure logic unit tests
│   └── order.test.ts           # Order total, shipping, and tax calculation tests
├── integration/                # API route & RBAC integration tests
│   └── auth_rbac.test.ts       # Authorization guard tests for /admin & /vendor
└── e2e/                        # Playwright headless browser E2E specs
    └── checkout.spec.ts        # End-to-end customer checkout automation
```

---

## 🎯 Critical Test Flow Coverage Rules

Every meaningful code modification MUST be accompanied by appropriate test coverage for critical paths:

### 1. Authentication & RBAC (`tests/integration/`)
- Verify that unauthenticated requests to `/api/admin/*` and `/api/vendor/*` return `401 Unauthorized`.
- Verify that `CUSTOMER` users attempting to access `/api/admin/*` receive `403 Forbidden`.

### 2. Business Math & Order Logic (`tests/unit/`)
- Verify tax, shipping tier additions, discount calculations, and grand total summations.
- Test zero item edge cases and fractional currency precision.

### 3. Storefront Checkout E2E (`tests/e2e/checkout.spec.ts`)
- Automated Playwright spec navigating storefront: `Add Product to Cart → Open Cart → Proceed to Checkout → Fill Address → Submit Stripe Payment`.

---

## 📜 Rules for Writing Maintainable Tests

1. **Verify Behavior, Not Implementation**: Tests must assert expected output data or UI DOM changes, not internal private variable states.
2. **Mock Third-Party External Services**: Always mock external APIs (Stripe PaymentIntents, Nodemailer SMTP, RabbitMQ connections) in unit/integration tests.
3. **Use Accessible Playwright Selectors**: In E2E tests, use accessible role selectors (`page.getByRole('button', { name: 'Checkout' })`) rather than fragile CSS class selectors.
