# 🎨 UI / UX Design System & Interface Standards — Nati Platform

This document establishes the UI/UX design rules, visual language standards, responsiveness requirements, and interface state guidelines for the **Nati.** E-Commerce Platform.

---

## 🎨 Visual Language & Design Tokens

### 1. Palette & Dark/Light Mode
- **Theme Engine**: Built with `next-themes` and CSS variables located in [`frontend/src/app/globals.css`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/app/globals.css).
- **Primary Aesthetics**: Glassmorphic UI overlays (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`), subtle gradients, clean slate/zinc neutral tones.
- **Rule**: Do NOT inject random custom hex codes or ad-hoc colors. Use Tailwind token utility classes (e.g., `text-slate-900 dark:text-slate-100`, `bg-indigo-600 hover:bg-indigo-700`).

### 2. Typography & Hierarchy
- **Font Stack**: Clean system sans-serif font stack configured in Tailwind.
- **Hierarchy Rules**:
  - Main Page Titles: `text-2xl min-[400px]:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`
  - Section Headers: `text-lg font-semibold text-slate-800 dark:text-slate-200`
  - Body Text: `text-sm text-slate-600 dark:text-slate-400`
  - Micro-copy / Captions: `text-xs text-slate-500 dark:text-slate-500`

### 3. Iconography & Animations
- **Icons**: Use `lucide-react` icons exclusively. Maintain consistent sizing (`w-4 h-4` for inline micro-icons, `w-5 h-5` for buttons, `w-6 h-6` for section headers).
- **Animations**: Use `framer-motion` for subtle entrance micro-animations, modal transitions, and dynamic tab switches. Avoid overly aggressive or slow animations.

---

## 📱 Responsive Layout & Viewport Rules

The interface must render flawlessly across all standard viewports without horizontal scrollbar overflow or text clipping:

| Viewport Tier | Screen Range | Layout Strategy & Rules |
| :--- | :--- | :--- |
| **Small Mobile** | **320px – 399px** | Single-column grids (`grid-cols-1`), fluid horizontal padding (`px-3`), compact text sizing (`text-xs` to `text-sm`), full-width buttons. |
| **Standard Mobile** | **400px – 639px** | 2-column product grids (`min-[360px]:grid-cols-2`), comfortable touch targets (minimum 44px height). |
| **Tablet** | **640px – 1023px** | 2 to 3-column product grids (`sm:grid-cols-2 md:grid-cols-3`), side-drawer navigation menus. |
| **Desktop** | **1024px+** | 4-column product grids (`lg:grid-cols-4`), persistent sidebar navigation for admin and vendor portals (`/admin`, `/vendor`). |

### 🛠️ Anti-Pattern Safeguards
- ❌ **NO Hardcoded Pixel Offsets**: Never hardcode width values like `w-[375px]` or fixed container heights. Use Tailwind responsive utilities (`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- ❌ **NO Unwrapped Data Tables**: Data tables in `/admin` and `/vendor` must always be wrapped in a scroll container: `<div className="overflow-x-auto w-full">...</div>` to prevent page-wide breaking on mobile.

---

## 🔁 Mandatory UI State Representations

Every interactive, data-fetching component MUST implement all four essential UI states:

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. Loading   │ ──► │  2. Empty    │ ──► │  3. Success  │ ──► │   4. Error   │
│   (Skeleton) │     │ (Zero state) │     │ (Data view)  │     │ (Alert/Toast)│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### 1. Loading State
- Use skeleton pulses (`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md`) matching the exact shape of the expected cards/rows instead of plain blank screens.
- Use spinner icons (`<Loader2 className="w-4 h-4 animate-spin" />`) inside buttons during active network calls.

### 2. Empty State
- Render helpful, friendly empty state cards with an icon, descriptive heading, contextual description, and actionable call-to-action (CTA) button (e.g. "Your cart is empty — Browse Products").

### 3. Success State
- Smoothly present loaded data. Provide immediate visual feedback for user actions (e.g., instant badge counter bump in Cart / Wishlist).

### 4. Error State
- Display inline error banners or toast notifications with actionable recovery steps (e.g. "Failed to load products — Retry").
- Never allow raw stack traces or JSON blobs to render on screen.

---

## 📝 Form & Button Interaction Rules

- **Submit Button Handling**: Submit buttons MUST disable during active processing (`disabled={isLoading}`) and display a loading spinner to prevent duplicate form submissions or duplicate orders.
- **Validation Messages**: Display clear, contextual validation errors directly beneath input fields in red (`text-red-500 text-xs mt-1`).
- **Focus Indicators**: All form controls must feature prominent focus rings (`focus:ring-2 focus:ring-indigo-500 focus:outline-none`).

---

## 🧩 Component Reuse Requirements

Before creating any new UI component, the AI agent MUST inspect:
1. Primitive UI components in [`frontend/src/components/ui/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/components/ui)
2. Shared layout components in [`frontend/src/components/layout/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/components/layout)
3. Specialized domain components in [`frontend/src/components/shared/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/components/shared)

Always extend existing components via props before creating duplicate UI widgets.
