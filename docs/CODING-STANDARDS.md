# 📜 Coding Standards & Repository Conventions — Nati Platform

This document outlines the coding standards, TypeScript rules, file organization, component guidelines, and architectural patterns enforced across the **Nati.** E-Commerce repository.

---

## 📁 Repository Structure & File Organization

Maintain strict folder organization across the monorepo:

```text
Ecommerce/
├── frontend/                   # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                # Next.js routes & API handlers (/api/*)
│   │   ├── components/         # React components organized by domain
│   │   │   ├── ui/             # Primitive design system components (Button, Input, Modal)
│   │   │   ├── layout/         # Header, Navbar, Footer, Sidebar
│   │   │   ├── shared/         # Cross-domain shared UI components
│   │   │   ├── Checkout/       # Checkout & payment forms
│   │   │   ├── ProductDetails/ # Product detail gallery, variant matrix
│   │   │   ├── AdminDashboard/ # Admin telemetry & management grids
│   │   │   └── vendor/         # Vendor portal components
│   │   ├── hooks/              # Custom React hooks & React Query hooks
│   │   ├── lib/                # Shared utilities, Axios instance, helper calculations
│   │   ├── store/              # Zustand state stores (cart, wishlist, auth, etc.)
│   │   ├── services/           # API domain service modules
│   │   └── types/              # Central TypeScript interfaces
├── backend/                    # Node.js Express Microservices Monorepo
│   ├── api-gateway/            # Ingress proxy & rate limiting
│   ├── shared/                 # Shared @ecom/shared interfaces, errors, middleware
│   └── services/               # Express microservices (auth, order, product, etc.)
├── tests/                      # Testing suites (unit, integration, e2e)
├── docs/                       # Project documentation system
└── AGENTS.md                   # Master AI agent instructions
```

---

## 🔤 Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **React Components** | PascalCase | `ProductCard.tsx`, `AdminHeader.tsx` |
| **TypeScript Files & Utilities** | camelCase | `api.ts`, `authHelper.ts`, `utils.ts` |
| **Custom Hooks** | camelCase with `use` prefix | `useAuth.ts`, `useCart.ts` |
| **Zustand Stores** | camelCase with `Store` suffix | `cartStore.ts` or `cart.ts` |
| **Types & Interfaces** | PascalCase | `IProduct`, `IUser`, `OrderItem` |
| **Environment Variables** | UPPER_CASE_SNAKE | `NEXT_PUBLIC_API_URL`, `JWT_SECRET` |
| **Database Collections** | PascalCase Singular | `User`, `Order`, `VendorProduct` |
| **API Endpoints** | kebab-case plural | `/api/vendor-products`, `/api/order-items` |

---

## 🟦 Strict TypeScript Rules

1. **No `any` Types**: Explicitly define types using TypeScript interfaces or types.
2. **Centralized Types**: Put shared domain interfaces inside [`frontend/src/types/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/types) or [`backend/shared/src/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/backend/shared/src).
3. **Explicit Prop Types**: Every React component must define an explicit props interface:
   ```tsx
   interface ProductCardProps {
     product: IProduct;
     onAddToCart?: (productId: string) => void;
     className?: string;
   }

   export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, className }) => {
     // ...
   };
   ```
4. **No `@ts-ignore`**: Resolve type errors cleanly through proper typing or type guards.

---

## ⚛️ React & Next.js Guidelines

1. **Server vs. Client Components**:
   - Default to Server Components (`.tsx`) for pages requiring static/SSR data fetching.
   - Use `'use client'` directive ONLY on components requiring browser interactivity, state hooks (`useState`, `useEffect`), or Zustand stores.
2. **State Management Division**:
   - **Client App State**: Zustand (`frontend/src/store`) for cart, wishlist, auth tokens, active UI selections.
   - **Server State & Caching**: TanStack React Query v5 for API data fetching, revalidation, and caching.
3. **Avoid Over-Engineering**:
   - Do NOT create unnecessary custom context providers or custom hooks for simple component-local state.
   - Do NOT add external dependencies when native JavaScript / built-in utilities work.

---

## 🛠️ Error Handling & Async Operations

- Always handle errors explicitly in async functions using `try...catch` blocks or React Query error callbacks.
- Pass errors through the centralized error normalization helper in `frontend/src/lib/api.ts` or `backend/shared/src/middleware/errorHandler.ts`.
- Never leave dangling unhandled promise rejections.
