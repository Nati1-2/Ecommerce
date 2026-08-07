# 🧪 Testing Strategy & Quality Assurance Framework

This document outlines the testing pyramid, unit testing, integration workflows, and Playwright End-to-End (E2E) automation for the Nati Store E-Commerce Platform.

---

## 📐 Testing Pyramid

```
                       ┌───────────────────────┐
                       │  Playwright E2E Tests │
                       └───────────┬───────────┘
                                   │
                       ┌───────────┴───────────┐
                       │   Integration Tests   │
                       └───────────┬───────────┘
                                   │
                       ┌───────────┴───────────┐
                       │   Unit Test Coverage  │
                       └───────────────────────┘
```

---

## 🛠️ Executing Tests

### 1. Unit Tests (Vitest)
Executes business logic calculation tests for order totals, tax rates, and invoice items:
```bash
npm test
```

### 2. End-to-End Tests (Playwright)
Executes headless browser automation testing storefront browsing, checkout flow, vendor dashboard, and admin permissions:
```bash
npx playwright test
```

---

## ⚙️ CI Automated Testing Pipeline

Every Pull Request automatically executes:
1. `npx tsc --noEmit` (TypeScript Type Validation)
2. `npm run lint` (ESLint Standards)
3. `npm test` (Unit & Business Logic Verification)
4. `npx playwright test` (E2E Headless Browser Verification)
