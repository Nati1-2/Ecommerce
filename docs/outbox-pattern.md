# 📦 Transactional Outbox Pattern Specification

This document details the Transactional Outbox pattern implemented to guarantee event delivery without dual-write inconsistencies.

---

## 🔒 Transactional Outbox Guarantees

1. **At-Least-Once Delivery**: Events are written directly into MongoDB inside the same database transaction as business objects (`OutboxEvent`).
2. **Dead-Letter Handling**: If a consumer fails 5 consecutive times (`retryCount >= 5`), the event transitions to `FAILED` status for admin manual inspection.
