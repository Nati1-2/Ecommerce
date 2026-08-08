# ADR-002: Event-Driven Architecture & Transactional Outbox

## Status
Accepted

## Context
Direct synchronous HTTP calls during checkout lead to high latency and failure cascade risk if downstream services fail.

## Decision
We implement a **Transactional Outbox Pattern** (`OutboxEvent` collection) combined with an asynchronous `DomainEvents` publisher.
- Business actions write outbox events inside the database transaction.
- Background outbox workers process and dispatch events to inventory, notification, and analytics consumers.

## Consequences
- Guaranteed at-least-once event delivery.
- Asynchronous decoupling reduces API latency to < 35ms.
