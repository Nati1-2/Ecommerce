# Security Threat Model & Mitigation Matrix

STRIDE-based threat analysis for the Nati Store marketplace platform.

---

## Threat Matrix

| # | Threat | Category | Severity | Protection | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T-01 | Credential stuffing / brute force | Spoofing | HIGH | Rate limiting (Redis-backed), account lockout after 5 failures, bcrypt cost factor 12 | ✅ Implemented |
| T-02 | Payment amount spoofing | Tampering | CRITICAL | Server-side price calculation from MongoDB, never trust client-sent amounts, Stripe webhook verification | ✅ Implemented |
| T-03 | Admin privilege escalation | Elevation | CRITICAL | `requireAdmin()` middleware validates JWT role claim on every admin route, role stored server-side in MongoDB | ✅ Implemented |
| T-04 | Cross-Site Scripting (XSS) | Tampering | HIGH | React's built-in JSX escaping, Content-Security-Policy headers, input sanitization on API routes | ✅ Implemented |
| T-05 | Cross-Site Request Forgery (CSRF) | Spoofing | MEDIUM | SameSite=Strict cookies, Origin header validation, API routes require Authorization header | ✅ Implemented |
| T-06 | Inventory manipulation | Tampering | HIGH | Server-side stock validation, Redis reservation locks, MongoDB `$inc` with floor check (`stock >= quantity`) | ✅ Implemented |
| T-07 | JWT token theft | Spoofing | HIGH | 15-minute access token expiry, refresh token rotation, token revocation list | ✅ Implemented |
| T-08 | Stripe webhook replay attack | Replay | HIGH | `stripeEventId` uniqueness check in PaymentEvent collection, idempotent processing | ✅ Implemented |
| T-09 | Vendor accessing other vendor's data | Information Disclosure | HIGH | All vendor API routes filter by `vendorId` from JWT, never from request params | ✅ Implemented |
| T-10 | Mass assignment / over-posting | Tampering | MEDIUM | Mongoose schemas define strict field allowlists, unknown fields rejected | ✅ Implemented |
| T-11 | Denial of Service (API) | Denial of Service | MEDIUM | Vercel's built-in DDoS protection, payload size limits, request throttling | ✅ Implemented |
| T-12 | Supply chain attack | Tampering | MEDIUM | Dependabot automated dependency updates, `npm audit` in CI pipeline, lockfile integrity | ⚠️ Configured |

---

## Secrets Management

| Secret | Storage | Rotation |
| :--- | :--- | :--- |
| `JWT_SECRET` | Vercel Environment Variable | Manual — rotate quarterly |
| `STRIPE_SECRET_KEY` | Vercel Environment Variable | Via Stripe Dashboard — rotate on compromise |
| `STRIPE_WEBHOOK_SECRET` | Vercel Environment Variable | Regenerate when webhook endpoint changes |
| `MONGODB_URI` | Vercel Environment Variable | Atlas credential rotation via API |
| `REFRESH_TOKEN_SECRET` | Vercel Environment Variable | Manual — rotate quarterly |

**Environment Validation**: `envCheck.ts` validates all critical secrets are present at application startup. Missing secrets cause a hard failure with descriptive error message.

---

## Dependency Security

- **Dependabot**: Configured for automated PR creation on vulnerable dependencies
- **`npm audit`**: Runs in CI pipeline, build fails on critical vulnerabilities
- **Lock file**: `package-lock.json` committed and integrity-checked

---

## Incident Response

1. **Detection**: Sentry error alerts, Prometheus metric anomalies, Vercel function error logs
2. **Containment**: Revoke compromised tokens, rotate secrets, enable maintenance mode
3. **Recovery**: Deploy patched version via Vercel, verify via health checks
4. **Post-mortem**: Document incident in `docs/incidents/` directory
