# 💳 Payment Flow Architecture

This document describes the Stripe integration, payment session creation, and asynchronous webhook handling.

---

## 🔄 Payment Lifecycle Sequence

```
Customer Checkout ──► POST /api/payments/checkout-session ──► Stripe Payment Gateway
                                                                       │
                                                                       ▼
MongoDB Order Updated ◄── POST /api/payments/webhook ◄── Payment Successful
(paymentStatus = PAID)     (Signature Validation)
```

---

## 🛡️ Webhook Security & Signature Validation

1. **Stripe Signature Header**:
   - Every incoming event from Stripe includes `stripe-signature`.
2. **Verification**:
   - `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)` validates event integrity against `STRIPE_WEBHOOK_SECRET`.
3. **Status Sync**:
   - Updates `Order.paymentStatus = PaymentStatus.PAID` and `Order.orderStatus = OrderStatus.PROCESSING`.
