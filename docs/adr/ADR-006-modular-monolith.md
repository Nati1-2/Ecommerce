# ADR-006: Modular Monolith vs Microservices Architecture

## Status
Accepted

## Context
The platform serves three distinct user roles (Customer, Vendor, Admin) with six core domain boundaries: Authentication, Orders, Payments, Inventory, Search, and Notifications. The team must decide between deploying as a monolith or extracting services.

## Decision
We adopt a **Modular Monolith** pattern deployed on Vercel Serverless.

### Why Not Microservices Now

| Factor | Modular Monolith | Microservices |
| :--- | :--- | :--- |
| Team size required | 1-3 engineers | 5+ engineers minimum |
| Deployment complexity | Single Vercel project | Multiple services, API gateway, service mesh |
| Data consistency | In-process function calls | Distributed transactions (Saga pattern) |
| Debugging | Single log stream | Distributed tracing required |
| Cold start latency | One function warmup | N services × cold start |
| Infrastructure cost | ~$20/month (Vercel Pro) | ~$200-500/month (multiple services) |

### Current Service Boundaries (In-Process Modules)

```
src/services/
├── payment-service/     # Stripe integration, refunds
├── inventory-service/   # Stock reservation, release
├── search-service/      # Full-text search, autocomplete  
├── ledger-service/      # Financial ledger, vendor payouts
└── shipping-service/    # Multi-carrier tracking
```

### Future Extraction Plan

**Phase 1** (>1000 orders/day): Extract Payment Service
- Reason: Stripe webhook processing benefits from independent scaling and failure isolation
- Communication: REST API + OutboxEvent publishing

**Phase 2** (>5000 orders/day): Extract Inventory Service  
- Reason: Stock reservation requires sub-10ms Redis locking independent of order processing

**Phase 3** (>10M products): Extract Search Service
- Reason: Search indexing becomes resource-intensive; dedicated Meilisearch/Elasticsearch cluster

**Phase 4** (>50k daily notifications): Extract Notification Service
- Reason: Email/push notification volume requires dedicated queue workers

## Consequences
- Faster iteration speed with single deployment
- Risk of coupling if module boundaries are not enforced via explicit interfaces
- Team must maintain discipline: services communicate through defined interfaces, not direct model imports
