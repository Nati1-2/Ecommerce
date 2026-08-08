# ADR-003: Modular Monolith Domain Service Boundaries

## Status
Accepted

## Context
Deploying full microservices with Kubernetes introduces massive operational complexity and cold starts on Vercel Edge networks.

## Decision
We structure the codebase as a **Production-Grade Modular Monolith**:
- `services/payment-service/`
- `services/inventory-service/`
- `services/search-service/`
- `services/ledger-service/`
- `services/shipping-service/`

## Consequences
- Clean separation of concerns with strong domain boundaries.
- Native compatibility with Vercel Serverless deployments.
