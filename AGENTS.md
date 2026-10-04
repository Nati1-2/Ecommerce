# 🤖 Master AI Agent Operating Instructions — Nati E-Commerce Platform

This document serves as the master instruction file for AI coding agents operating on the **Nati.** E-Commerce Platform repository. Every AI interaction must adhere strictly to the guidelines, workflows, and standards defined here and detailed in the [`docs/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs) documentation system.

---

## 🎯 Core Operating Principles

When performing any task in this codebase, the AI coding agent MUST follow these 18 core directives:

1. **Inspect Before Modifying**: Never write or edit code without first inspecting existing files, imports, schemas, and usage patterns.
2. **Understand Architecture First**: Read and align with the existing decoupled Next.js + Express microservices architecture before designing changes.
3. **Search for Reusable Code**: Search `frontend/src/components/`, `frontend/src/store/`, `frontend/src/services/`, `backend/shared/`, and existing utilities before writing new helper functions or components.
4. **Avoid Duplicated Logic & Components**: Never duplicate existing UI primitives, Zustand stores, state handlers, or backend error/auth logic.
5. **Keep Changes Focused**: Scope changes strictly to the explicit request. Do not refactor unrelated code or alter surrounding whitespace unnecessarily.
6. **Never Modify Unrelated Functionality**: Do not break, move, or delete working features unless explicitly requested.
7. **Prefer Simple, Maintainable Solutions**: Avoid over-engineering. Do not add external dependencies or complex abstractions when built-in project capabilities suffice.
8. **Follow Existing Project Conventions**: Maintain established naming conventions, directory organization, prop structures, and TypeScript patterns.
9. **Separate Business Logic from Presentation**: Keep business rules, state mutations, and API calls inside stores, custom hooks, or services—not directly in visual JSX components.
10. **Use Strong Typing & Avoid Unsafe Shortcuts**: Use strict TypeScript interfaces. Never use `any`, `@ts-ignore`, or unsafe type assertions (`as unknown as X`) unless strictly required and justified.
11. **Validate All External & Untrusted Input**: Enforce strict validation on all incoming API payloads, route params, query strings, and form inputs using Zod schemas.
12. **Handle Asynchronous Operations Correctly**: Use proper `async/await` handling, error wrapping, cancellation signals where appropriate, and avoid unhandled promise rejections.
13. **Implement Complete UI States**: Every data-driven UI feature must explicitly handle **Loading**, **Empty**, **Success**, and **Error** states.
14. **Consider Edge Cases**: Verify mobile screen sizes (320px viewport), slow network latency, empty arrays, nullish DB records, duplicate submissions, and race conditions.
15. **Add or Update Tests**: Write or update unit tests, integration tests, or Playwright E2E specs whenever modifying or adding meaningful features.
16. **Run Validation Commands**: After making edits, run type checking (`npx tsc --noEmit`), linting (`npm run lint`), and tests to ensure zero regressions.
17. **Review Final Diff**: Carefully review the output diff before declaring a task complete to verify no extraneous edits were introduced.
18. **Never Claim Verification Without Evidence**: Do not report that a feature works without running the appropriate build, test, or empirical runtime checks.

---

## 🔄 Mandatory AI Workflow Cycle

For every non-trivial task, the AI agent MUST strictly follow this 8-step execution loop:

```text
1. Understand ──► 2. Inspect ──► 3. Plan ──► 4. Implement ──► 5. Test ──► 6. Debug ──► 7. Review ──► 8. Verify
```

### 1. Understand
Read the user request carefully. Clarify ambiguous requirements by making the safest, most reasonable technical interpretation based on existing codebase patterns.

### 2. Inspect
Locate and view relevant source files. Check existing components in [`frontend/src/components/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/components), store definitions in [`frontend/src/store/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/frontend/src/store), backend services in [`backend/services/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/backend/services), and shared modules in [`backend/shared/`](file:///c:/Users/Win%2010/Desktop/Ecomerce/backend/shared).

### 3. Plan
Formulate a minimal, precise implementation strategy. Identify modified files and verify component/API contracts before touching code.

### 4. Implement
Apply precise code edits using established project conventions. Maintain documentation integrity, existing comments, and strict TypeScript types.

### 5. Test
Execute project validation tools:
- Type Check: `npx tsc --noEmit`
- Linting: `npm run lint` (in `frontend`)
- Unit & Integration Tests: `npm test` (in root or service folders)
- Playwright E2E: `npx playwright test`

### 6. Debug
If errors or broken assertions occur, fetch and analyze full stack traces. Fix root causes cleanly without masking symptoms or swallowing exceptions.

### 7. Review
Review the final `git diff` to confirm that changes are clean, formatted, and strictly scoped to the task.

### 8. Verify
Report results with concrete empirical evidence (passing command outputs, test results, or verified endpoints).

---

## 📚 Specialized Instruction System Sub-Docs

Refer to these specialized rule documents for detailed technical guidance in specific domains:

| Sub-Doc | Domain & Focus Areas |
| :--- | :--- |
| 📦 [`PRODUCT.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/PRODUCT.md) | Business domain, user personas, core customer/vendor/admin workflows. |
| 🏗️ [`ARCHITECTURE.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/ARCHITECTURE.md) | System topology, Next.js App Router, Express Gateway, microservices, RabbitMQ, Redis Redlock. |
| 🎨 [`UI-UX.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/UI-UX.md) | Mobile-first UI standards (320px+), Tailwind CSS tokens, state representation, responsiveness. |
| 📜 [`CODING-STANDARDS.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/CODING-STANDARDS.md) | TypeScript rules, file naming, component architecture, state management patterns. |
| ⚛️ [`FRONTEND.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/FRONTEND.md) | Next.js 15 Server/Client components, React Query v5, Zustand stores, Axios clients. |
| ⚙️ [`BACKEND.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/BACKEND.md) | Node.js Express microservices, controllers, services, RBAC middleware, event bus. |
| 🗄️ [`DATABASE.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/DATABASE.md) | MongoDB Atlas schemas, Mongoose models, indexing, transactions, Redis locking & caching. |
| 🔌 [`API.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/API.md) | RESTful API Gateway conventions, Zod validation, HTTP status codes, Stripe webhooks. |
| 🛡️ [`SECURITY.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/SECURITY.md) | JWT access/refresh rotation, RBAC, input sanitization, secret management, CORS, Helmet. |
| 🧪 [`TESTING.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/TESTING.md) | Playwright E2E automation, Jest unit/integration tests, test runner commands. |
| ⚡ [`PERFORMANCE.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/PERFORMANCE.md) | Latency SLAs, `next/dynamic` code splitting, query optimization, k6 load testing. |
| ♿ [`ACCESSIBILITY.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/ACCESSIBILITY.md) | WCAG 2.1 AA targets, semantic HTML, keyboard focus management, ARIA announcements. |
| 🚨 [`ERROR-HANDLING.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/ERROR-HANDLING.md) | Unified `CustomError` hierarchy, toast feedback, API error formatting, log sanitization. |
| 🚀 [`DEPLOYMENT.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/DEPLOYMENT.md) | Vercel frontend, Docker microservices setup, environment configurations, `/api/health`. |
| ✅ [`DEFINITION-OF-DONE.md`](file:///c:/Users/Win%2010/Desktop/Ecomerce/docs/DEFINITION-OF-DONE.md) | Final pre-flight completion checklist before delivering work. |

---

## 🛠️ Project Validation Commands Quick Reference

Run these commands from the project root or subdirectories to validate changes:

```bash
# Type Check (Frontend & Monorepo)
NODE_OPTIONS="--max-old-space-size=4096" npx tsc --noEmit --project frontend/tsconfig.json

# Linting
npm run lint --prefix frontend

# Frontend Production Build Check
npm run build --prefix frontend

# Shared Package Build
npm run build:shared --prefix backend

# Execute Unit / Integration Tests
npm test

# Execute Playwright E2E Tests
npx playwright test
```
