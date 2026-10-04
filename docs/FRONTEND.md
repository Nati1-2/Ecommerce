# ⚛️ Frontend Architecture & Component Guidelines — Nati Platform

This document details the frontend implementation rules, Next.js 15 App Router patterns, state management architecture, API integrations, and form validation strategies for the **Nati.** E-Commerce Platform.

---

## 🏗️ Architecture Overview

The frontend is built on **Next.js 15.5** (React 19) with TypeScript 5 in strict mode. It employs a hybrid rendering strategy:
- **Server Components**: Used for initial page shells, static content, SEO landing pages, and initial data hydrations.
- **Client Components**: Used for interactive widgets, variant selectors, Zustand store consumers, cart operations, and live dashboard panels.

---

## 📁 Directory Structure & Key Files

```text
frontend/src/
├── app/                        # Next.js App Router Pages & API Route Handlers
│   ├── (storefront)/           # Public shopping pages (products, cart, checkout)
│   ├── admin/                  # Super Admin Control Center (/admin)
│   ├── vendor/                 # Seller Vendor Portal (/vendor)
│   ├── api/                    # Serverless Next.js API Routes (/api/*)
│   ├── globals.css             # Design system CSS variables & Tailwind directives
│   └── layout.tsx              # Root Layout wrapping providers
├── components/                 # React UI Components
│   ├── ui/                     # Basic UI primitives (Button, Modal, Input, Badge)
│   ├── layout/                 # Navbar, MobileNav, Footer, Sidebar
│   ├── Checkout/               # Checkout wizard & Stripe Payment Element
│   ├── ProductDetails/         # Image gallery, dynamic variant selector
│   └── AdminDashboard/         # Telemetry charts, health mesh, user tables
├── hooks/                      # Custom hooks (useAuth, useSocket, useCart)
├── lib/                        # Axios instance, API helpers, formatters
├── store/                      # Zustand state stores
├── services/                   # Modular API service modules
└── types/                      # Shared TypeScript interface definitions
```

---

## 🏬 State Management Strategy

We maintain a strict separation between **Client Store State** and **Server Cache State**:

```text
               ┌────────────────────────────────────────────────────────┐
               │              Frontend State Architecture               │
               └───────────────────────────┬────────────────────────────┘
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                │                                                     │
                ▼                                                     ▼
    ┌──────────────────────┐                              ┌──────────────────────┐
    │  Zustand Stores      │                              │ React Query v5       │
    │  (Client Local State)│                              │ (Server Cache State) │
    └───────────┬──────────┘                              └───────────┬──────────┘
                │                                                     │
    ├── Cart items & badge count                          ├── Product catalog queries
    ├── Wishlist items                                    ├── User order history
    ├── Auth tokens & active user                         ├── Vendor dashboard metrics
    └── UI drawer open states                             └── Admin telemetry stats
```

### 1. Client State (Zustand)
- Stores are located in [`frontend/src/store/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/store).
- Persisted stores use `persist` middleware (e.g. `cartStore` and `wishlistStore`) to save state in `localStorage`.
- State mutations must happen strictly through store actions (e.g., `addItem`, `removeItem`, `clearCart`).

### 2. Server State (TanStack React Query v5)
- Use `useQuery` for fetch operations and `useMutation` for side-effect operations (POST, PUT, DELETE).
- Define explicit query keys in constant arrays (e.g., `['products', filters]`, `['admin-stats']`).
- Use `queryClient.invalidateQueries({ queryKey: [...] })` following successful mutations to keep cache fresh.

---

## 📝 Form Handling & Validation

- Use **React Hook Form** paired with **Zod** schema resolvers (`@hookform/resolvers/zod`).
- Form schema definitions must be typed using `z.infer<typeof Schema>`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export const ShippingForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit = async (data: ShippingFormData) => {
    // Process submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input fields with validation error text */}
    </form>
  );
};
```

---

## 🔌 API Service Layer

- Centralized API requests pass through the Axios instance configured in [`frontend/src/lib/api.ts`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/lib/api.ts).
- Request interceptors automatically attach JWT access tokens from local storage or memory.
- Response interceptors catch `401 Unauthorized` errors and attempt token refresh before throwing normalized error objects.

---

## 📱 Mobile Responsiveness Checklist

When building or modifying frontend components:
- [ ] Test viewports at 320px, 375px, 768px, and 1280px.
- [ ] Ensure tap targets (buttons, links, inputs) have a minimum height of 44px on touch devices.
- [ ] Wrap data tables or multi-column grids in `overflow-x-auto` to prevent horizontal page scrolling.
- [ ] Implement responsive padding (`px-3 min-[400px]:px-4 sm:px-6`).
