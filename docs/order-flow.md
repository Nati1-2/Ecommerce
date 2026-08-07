# 📦 End-to-End Order Flow Architecture

This document details how orders are processed across Customer, Vendor, and Admin ecosystems.

---

## 🔁 Multi-Party Order Lifecycle

```
1. Customer Cart Checkout ──► Creates MongoDB Order (#ORD-123)
2. Notification Engine   ──► Dispatches persistent Notification to Vendor & Admin
3. Vendor Dashboard      ──► Order instantly appears in /vendor/orders
4. Order Fulfillment     ──► Vendor accepts order & updates status:
                             Pending ──► Processing ──► Shipped (Adds Tracking #)
5. Customer Live Update  ──► Customer sees real-time status in /orders/[id]/tracking
```
