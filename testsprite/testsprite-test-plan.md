# TestSprite Test Plan — Amplifii Electronics

## Project

**Application:** Amplifii Electronics E-Commerce  
**TestSprite Project Name:** Amplifii Electronics QA  
**Base URL (local):** http://localhost:5173  
**Base URL (deployed):** https://amplifii.vercel.app

---

## Objective

Use TestSprite to:
1. Generate AI-assisted test scenarios covering critical user flows
2. Discover edge cases and negative paths missed in manual planning
3. Explore accessibility and API error risks
4. Log and track defects found during exploratory sessions
5. Export reports for portfolio evidence

---

## Application Areas Submitted to TestSprite

| Area | Description |
|---|---|
| Authentication | Login, logout, locked user, invalid credentials |
| Product Catalog | List, search, filter by category, sort by price |
| Product Detail | Single product view, out-of-stock handling |
| Shopping Cart | Add, remove, update quantity, badge updates, empty state |
| Checkout | Form validation, order summary, card number, confirmation |
| Order History | Completed orders list, empty state |
| API Error Handling | 400/401/403/404 responses, malformed requests |
| Accessibility | ARIA labels, focus order, contrast, error announcements |

---

## Test Types Requested

| Type | Priority |
|---|---|
| Functional — happy path | Critical |
| Functional — negative / invalid input | High |
| Edge case | High |
| Boundary value | Medium |
| Accessibility | Medium |
| API contract | High |
| Regression | High |

---

## Scope Boundaries

**In scope:**
- All 7 UI pages
- All 10 backend API endpoints
- Auth flows (standard, locked, admin)
- Cart and checkout flows

**Out of scope:**
- Real payment processing
- Email notifications
- Admin dashboard
- Enterprise-scale load scenarios
- Visual regression

---

## TestSprite Session Plan

| Session | Focus | Target |
|---|---|---|
| 1 | Generate test scenarios from prompt | 30–50 scenarios |
| 2 | Exploratory run on login + catalog | Defect discovery |
| 3 | Exploratory run on cart + checkout | Defect discovery |
| 4 | Accessibility scan | WCAG 2.1 risk areas |
| 5 | API edge cases | Error handling coverage |

---

## Outcome Criteria

- Accept scenarios that map to real risk areas
- Reject hypothetical or out-of-scope scenarios (document rejections)
- Convert every Critical/High defect into a Playwright regression test or Postman assertion
- Export TestSprite HTML reports to `testsprite/sample-reports/`
