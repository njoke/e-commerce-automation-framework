# QA Test Plan — Amplifii Electronics

**Version:** 1.0  
**Date:** 2026-05-27  
**Author:** QA Engineer  
**Status:** Active

---

## 1. Scope

### In Scope

| Area | Detail |
|---|---|
| Functional UI | Login, products, search/filter/sort, cart, checkout, confirmation, order history |
| API | All backend REST endpoints (auth, products, cart, orders) |
| Accessibility | All authenticated and public pages — Axe automated scan |
| Performance | Product API smoke test, checkout load test, spike test |
| Security (basic) | SQL injection and XSS negative login tests |
| Integration | Docker Compose end-to-end stack |

### Out of Scope

- Payment processing (mock only — no real payment gateway)
- Mobile native apps
- Visual regression testing
- Full WCAG 2.1 manual screen reader audit
- Load testing at enterprise scale (>50 VUs)
- Browser compatibility beyond Chromium

---

## 2. Objectives

1. Verify all critical user flows work end-to-end via automated Playwright tests
2. Validate all API contracts with Postman assertions (status codes, response schemas, error handling)
3. Confirm no critical accessibility violations on any page
4. Verify API performance meets defined thresholds under realistic load
5. Demonstrate defect discovery and tracking process via TestSprite workflow
6. Provide reproducible test execution via Docker + uv + Newman CLI

---

## 3. Test Environment

| Environment | URL | Purpose |
|---|---|---|
| Local (Docker) | http://localhost:5173 / :3001 | Primary test environment |
| Local (manual) | http://localhost:5173 / :3001 | Developer setup |
| Deployed (Vercel/Render) | See README live demo links | Portfolio demo + smoke verification |

### Environment Setup

```bash
cp frontend/.env.example frontend/.env
docker compose up --build
```

Frontend at `http://localhost:5173`, backend at `http://localhost:3001`.

### Test Credentials

| Username | Password | Role | Status |
|---|---|---|---|
| `standard_user` | `secret_sauce` | Standard | Active |
| `locked_user` | `secret_sauce` | Standard | Locked |
| `admin_user` | `admin_sauce` | Admin | Active |

---

## 4. Test Types and Tools

| Type | Tool | Location | Run Command |
|---|---|---|---|
| UI Smoke | Playwright + Python | `tests/playwright-python/specs/test_smoke.py` | `uv run pytest specs/test_smoke.py -v` |
| UI Regression | Playwright + Python | `tests/playwright-python/specs/` | `uv run pytest -v` |
| API Contract | Postman + Newman | `tests/postman/` | `newman run ...` |
| Accessibility | Axe + Playwright | `tests/accessibility/` | `uv run pytest ../accessibility/axe_accessibility_tests.py` |
| Performance | k6 | `tests/performance/` | `k6 run tests/performance/product_api_smoke_test.js` |

---

## 5. Test Data

| Source | Detail |
|---|---|
| Seed data | `backend/data/*.json` — 4 products, 3 users, empty cart/orders |
| Fixtures | `tests/playwright-python/fixtures/` — checkout_data.json |
| Postman environment | `tests/postman/ecommerce-local.postman_environment.json` |
| TestSprite test data | `testsprite/testsprite-test-data.md` |

**Note:** Tests must be independent. Cart state persists in backend JSON — reset between runs if needed by restarting Docker.

---

## 6. Entry Criteria

- [ ] `docker compose up --build` completes without error
- [ ] `GET http://localhost:3001/api/health` returns `{ "status": "ok" }`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] `uv sync` completes in `tests/playwright-python`
- [ ] `uv run playwright install` completes

---

## 7. Exit Criteria

- [ ] All Playwright test suites pass (0 failures)
- [ ] Newman run exits with code 0 (all 55 assertions pass)
- [ ] Axe scan reports 0 critical violations on all pages
- [ ] k6 `product_api_smoke_test.js` passes all thresholds: `p(95) < 500ms`, `error_rate < 1%`
- [ ] All Critical and High defects resolved or deferred with documented rationale

---

## 8. Risk and Mitigation

| Risk | Mitigation |
|---|---|
| Backend data mutation from cart/order tests | Restart Docker to reset JSON state between full runs |
| Playwright timing issues on slow CI runners | `wait_for_load_state("networkidle")` on all page transitions |
| MUI component selector instability | Use `data-testid` and `aria-labelledby` — avoid CSS class selectors |
| Render cold start (deployed env) | Document ~30s cold start; run health check before Postman suite |
| Auth state lost on page reload | Fixed via localStorage persistence in AuthContext |

---

## 9. Deliverables

| Deliverable | Location |
|---|---|
| Playwright HTML report | `reports/playwright/report.html` |
| Newman HTML report | `reports/postman/report.html` |
| Axe JSON report | `reports/accessibility/axe-report.json` |
| k6 results | Terminal output + `reports/k6/` |
| TestSprite artifacts | `testsprite/` |
| QA documentation | `docs/` |
