# QA Test Strategy — Amplifii Electronics

## 1. Overview

This document defines the test strategy for the Amplifii Electronics e-commerce application. The strategy applies risk-based testing principles to prioritize automation coverage on highest-impact user flows while maintaining broad coverage across UI, API, accessibility, and performance layers.

---

## 2. Testing Approach

### Risk-Based Prioritization

Test effort is allocated proportional to business risk. Revenue-critical flows (login, cart, checkout) receive the highest automation coverage. Lower-risk areas (order history display, accessibility warnings) receive lighter coverage.

### Shift-Left Philosophy

Testing begins at the API layer during development, before UI automation is complete. Postman collection is built in parallel with the backend API, enabling early defect detection without waiting for frontend completion.

### Defense in Depth

Each critical flow is tested at multiple layers:
- **API layer** — Postman/Newman validates contracts, status codes, and response schemas
- **UI layer** — Playwright validates end-to-end user flows including form validation
- **Accessibility layer** — Axe scans every authenticated and public page
- **Performance layer** — k6 validates API responsiveness under load

---

## 3. Test Levels

| Level | Tool | Scope | Trigger |
|---|---|---|---|
| API Contract | Postman + Newman | All backend endpoints | PR to main |
| UI End-to-End | Playwright + Python | Login, products, cart, checkout, orders | PR to main |
| Smoke | Playwright (test_smoke.py) | Full purchase flow | Every PR |
| Accessibility | Axe + Playwright | All pages | Manual / PR |
| Performance | k6 | Product API, checkout, health | Manual (workflow_dispatch) |
| Exploratory | TestSprite + Manual | Edge cases, boundary inputs | Per sprint |

---

## 4. Tools Rationale

| Tool | Why Chosen |
|---|---|
| Playwright + Python | Cross-browser, async-capable, excellent selector engine. Python chosen for uv ecosystem and pytest integration. |
| Postman + Newman | Industry-standard API testing tool. Newman enables CLI execution in CI with zero additional tooling. |
| TestSprite | AI-assisted scenario generation and exploratory testing — accelerates coverage discovery beyond manual scripting. |
| axe-playwright-python | Embeds WCAG-standard Axe engine directly in Playwright tests, no separate browser session needed. |
| k6 | JavaScript-native, runs in CI without Docker. Grafana k6 Cloud available for scale-up. |
| GitHub Actions | Native CI for GitHub repos. YAML-based, free tier sufficient for portfolio project. |
| uv | Modern Python package manager — reproducible environments, fast installs, lock file committed. |

---

## 5. Coverage Strategy by Feature

| Feature | Priority | API Tested | UI Tested | Axe Scanned | Notes |
|---|---|---|---|---|---|
| Login / Logout | Critical | ✅ | ✅ | ✅ | Security + auth flow |
| Product Catalog | Critical | ✅ | ✅ | ✅ | Revenue-critical display |
| Search + Filter + Sort | High | ✅ | ✅ | — | Catalog feature set |
| Add to Cart | Critical | ✅ | ✅ | ✅ | Direct revenue impact |
| Cart Management | High | ✅ | ✅ | ✅ | Quantity, remove |
| Checkout Form | Critical | ✅ | ✅ | ✅ | Validation + submission |
| Order Confirmation | Critical | — | ✅ | — | State-based page |
| Order History | High | ✅ | ✅ | ✅ | Post-purchase trust |
| API Error Handling | High | ✅ | — | — | 400/401/403/404 |
| Accessibility | Medium | — | — | ✅ | All pages, Axe CI gate |
| Performance | Medium | ✅ (k6) | — | — | Smoke + load + spike |

---

## 6. Automation Strategy

### What to Automate

- All critical and high-priority happy paths
- Negative paths with clear expected behavior (invalid login, empty cart checkout)
- API contract tests for all endpoints
- Accessibility CI gate (fail on critical violations only)

### What to Test Manually

- Visual regression (not in scope for v1)
- Complex exploratory scenarios (via TestSprite sessions)
- Keyboard navigation and screen reader compatibility
- Responsive layout at various breakpoints

### What NOT to Automate

- Render/Vercel deployment steps
- TestSprite session prompting and review
- One-time data seeding

---

## 7. Entry and Exit Criteria

### Entry Criteria (start testing)
- Backend health endpoint returns 200
- Frontend renders at http://localhost:5173
- Docker Compose starts both services cleanly

### Exit Criteria (ready for release)
- All Playwright tests pass
- All Newman API tests pass (0 failures)
- No critical Axe violations on any page
- k6 p(95) response time < 500ms on product API
- All Critical and High defects closed or deferred with documented rationale

---

## 8. Defect Severity Definitions

| Severity | Definition | Example |
|---|---|---|
| Critical | Application unusable, data loss, security breach | Checkout endpoint 404 |
| High | Core feature broken for most users | Auth state lost on reload |
| Medium | Feature degraded, workaround exists | Sort dropdown selector broken |
| Low | Minor UX issue, no functional impact | Badge shows empty string at 0 |
