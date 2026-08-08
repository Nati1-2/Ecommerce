# 💳 Extracted Payment Service Specification

This document details the modular boundaries and API interfaces of the Payment Service.

---

## 🔌 Payment Interfaces

- `processPaymentIntent(req)`: Generates Stripe client secrets and payment intents.
- `refundPayment(paymentIntentId)`: Handles full and partial refunds.
