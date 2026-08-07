# 🏗️ Nati Store — High-Level System Architecture

This document provides a comprehensive architectural overview of the Nati Store E-Commerce Platform.

---

## 📐 Overall System Topology

```
                               ┌───────────────────────────────────┐
                               │       Client Browsers / Apps       │
                               └─────────────────┬─────────────────┘
                                                 │
                                                 ▼
                               ┌───────────────────────────────────┐
                               │      Next.js Vercel Edge CDN      │
                               └─────────────────┬─────────────────┘
                                                 │
                                                 ▼
                               ┌───────────────────────────────────┐
                               │   API Gateway & Route Handlers    │
                               └────────┬─────────────────┬────────┘
                                        │                 │
              ┌─────────────────────────┴──┐           ┌──┴─────────────────────────┐
              │  Authentication & Security  │           │   Order & Payment Engine   │
              └─────────────┬──────────────┘           └────────────┬───────────────┘
                            │                                       │
                            ▼                                       ▼
              ┌────────────────────────────┐           ┌────────────────────────────┐
              │  MongoDB Atlas (Database)  │           │   Stripe Payment Gateway   │
              └────────────────────────────┘           └────────────────────────────┘
```

---

## 🧩 Architectural Layers

1. **Frontend Presentation Layer**:
   - **Framework**: Next.js 15 (React 19) App Router.
   - **Styling**: Vanilla CSS tokens & TailwindCSS utilities.
   - **State Management**: TanStack React Query v5 & Zustand.
   - **Themes**: Independent Light Mode presentation across Customer, Vendor, and Admin Dashboards.

2. **API & Business Logic Layer**:
   - **Route Handlers**: Next.js API Routes (`/api/*`) executing on Vercel Serverless Functions.
   - **Authentication**: JWT-based statutory session validation with role middleware (`CUSTOMER`, `VENDOR`, `ADMIN`).

3. **Persistence Layer**:
   - **Database**: MongoDB Atlas Cluster running Mongoose ORM models (`User`, `Order`, `VendorProduct`, `VendorProfile`, `Review`, `Notification`).

4. **Real-time Event Dispatch**:
   - Multi-channel notification engine pushing instant transactional alerts to Vendors, Customers, and Admins.
