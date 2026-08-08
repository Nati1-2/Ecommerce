# ADR-007: Event Architecture — Outbox Pattern vs Message Broker

## Status
Accepted (with planned migration path)

## Context
The platform publishes domain events (`OrderCreated`, `PaymentCompleted`, `InventoryReserved`, etc.) to decouple business logic from side effects (notifications, analytics, inventory updates).

## Decision
We implement the **MongoDB Transactional Outbox Pattern** as the current event infrastructure.

### Current Architecture

```
Business Transaction (e.g., Create Order)
        │
        ▼
MongoDB Transaction:
  1. Write Order document
  2. Write OutboxEvent document
        │
        ▼
Outbox Worker (Vercel Cron / API route)
  1. Poll PENDING events
  2. Dispatch to consumers
  3. Mark COMPLETED
  4. Retry FAILED (max 5 attempts)
```

### Why Not a Message Broker Now

| Factor | Outbox Pattern | RabbitMQ/Kafka |
| :--- | :--- | :--- |
| Infrastructure | Zero — uses existing MongoDB | Dedicated cluster required |
| Vercel compatibility | Native — runs as API routes/crons | Requires external hosting (CloudAMQP, Confluent) |
| Throughput | ~100 events/sec (sufficient for <10k orders/day) | 100k+ events/sec |
| Ordering guarantee | Per-aggregate via `createdAt` sort | Partition-level ordering |
| Cost | $0 additional | $50-500/month |

### Throughput Limits
The outbox worker polls every 15 minutes via Vercel Cron and processes 20 events per batch. This supports approximately:
- **Sustained**: ~1,920 events/day (80/hour)
- **Burst**: Higher if triggered via API route on-demand
- **Bottleneck**: MongoDB query latency for `status: PENDING` scan

### Migration Strategy (When Needed)

**Trigger**: When daily event volume exceeds 5,000 events or event processing latency exceeds 5 minutes.

**Target**: Upstash QStash or AWS EventBridge
- QStash: Serverless-native, HTTP-based message delivery, built for Vercel
- EventBridge: Higher throughput, native AWS integration

**Migration Steps**:
1. Add QStash/EventBridge publisher alongside outbox writer (dual-write phase)
2. Validate message delivery parity for 1 week
3. Switch consumers to read from new broker
4. Deprecate outbox polling worker
5. Keep OutboxEvent collection as audit log

## Consequences
- Zero additional infrastructure cost at current scale
- Event delivery latency of up to 15 minutes (acceptable for notifications, not for real-time inventory)
- Inventory reservations use direct Redis locking (not outbox) for sub-second latency
