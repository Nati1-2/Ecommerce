# ADR-001: MongoDB Atlas Database & Schema Architecture

## Status
Accepted

## Context
The platform requires a scalable, serverless-friendly database capable of handling high-volume e-commerce document structures (orders, multi-item products, user profiles, and audit trails).

## Decision
We select **MongoDB Atlas** with Mongoose ORM.
- Connection pooling is managed warm across Vercel Serverless Function invocations.
- Explicit schema indexing enforced on `email`, `role`, `orderId`, `userId`, `vendorId`, `status`, and `createdAt`.

## Consequences
- Flexible schema support for rich product variants and nested shipping addresses.
- Transactional Outbox pattern required to guarantee event publishing consistency without dual-write drift.
