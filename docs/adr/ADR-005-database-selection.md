# ADR-005: Database Selection — MongoDB Atlas vs PostgreSQL

## Status
Accepted

## Context
The marketplace platform requires a database that supports:
- Flexible product schemas with varying attribute sets across vendor categories
- High-throughput read operations for catalog browsing (target: 20k req/sec peak)
- Nested document structures for orders containing multiple line items, shipping addresses, and payment metadata
- Serverless-friendly connection pooling compatible with Vercel's ephemeral function model

## Options Considered

| Criteria | MongoDB Atlas | PostgreSQL (Supabase/Neon) |
| :--- | :--- | :--- |
| Schema flexibility | Native document model; no migrations for product variants | Requires JSONB columns or EAV pattern |
| Serverless connection model | Atlas Data API + connection pooling via `mongoose` cached connections | Requires PgBouncer or Neon's WebSocket proxy |
| Full-text search | Atlas Search (Lucene-based) available | `tsvector` + `pg_trgm` require manual index management |
| Transactions | Multi-document ACID transactions (v4.0+) | Full ACID with strong isolation levels |
| Joins | `$lookup` aggregation (limited) | Native JOINs — superior for relational queries |
| Ecosystem | Mongoose ODM, rich Node.js driver | Prisma, Drizzle, Knex — mature TypeScript ORMs |

## Decision
We select **MongoDB Atlas** for the following reasons:
1. **Product catalog flexibility**: Vendors sell products with wildly different attribute schemas (clothing sizes vs electronics specs vs digital goods). Document model eliminates schema migration friction.
2. **Order document locality**: An order document embeds its line items, shipping address, and payment metadata in a single read — no N+1 joins.
3. **Vercel compatibility**: `mongoose` connection caching across warm serverless instances avoids cold-start connection storms that plague PostgreSQL poolers.
4. **Atlas Search**: Built-in Lucene-powered full-text search eliminates the need for a separate Elasticsearch deployment at our current scale.

## Limitations & Risks
- **No native JOINs**: Cross-collection analytics (e.g., "vendor revenue by product category by month") require `$lookup` aggregation pipelines that are slower than PostgreSQL JOINs.
- **Weaker consistency guarantees**: Default `w:majority` write concern adds ~2-5ms latency vs single-node PostgreSQL writes.
- **Referential integrity**: No foreign key constraints — orphaned documents possible if application logic has bugs.
- **Cost at scale**: Atlas pricing for M10+ dedicated clusters exceeds PostgreSQL managed offerings for equivalent storage.

## Migration Trigger
Consider PostgreSQL migration if:
- Analytics queries exceed 30% of total database load
- We need complex multi-table reporting that `$lookup` cannot serve under 500ms
- Regulatory requirements demand strict referential integrity guarantees
