# ⚡ Event-Driven Architecture & Domain Event Publishing

This document describes the event-driven publishing pipeline, outbox worker polling, and domain event consumer patterns.

---

## 🔁 Event Flow Sequence

```
1. Business Action ──► Transactional Outbox Save (PENDING)
2. Outbox Worker    ──► Polls Outbox Collection & Publishes Event
3. Event Consumers  ──► Inventory Reserve / Notification / Analytics Processors
4. Outbox Worker    ──► Marks Event Status (COMPLETED)
```
