# 📦 Extracted Inventory Service Specification

This document details stock reservation workflows, atomic inventory updates, and stock release mechanisms.

---

## ⚙️ Inventory Operations

- `reserveStock(req)`: Temporarily holds inventory during checkout via Redis lock keys.
- `releaseStock(productId, quantity)`: Restores inventory if payment fails or expires.
