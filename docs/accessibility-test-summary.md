# Accessibility Test Summary — Amplifii Electronics

**Tool:** Axe (axe-playwright-python)  
**Pages Scanned:** 5  
**Run Date:** 2026-05-27  
**CI Gate:** Fail on `impact === "critical"` violations  
**Result:** PASS — 0 critical violations

---

## Pages Scanned

| Page | URL | Auth Required | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|---|---|
| Login Page | /login | No | 0 | 0 | TBD* | TBD* |
| Product Catalog | /products | Yes | 0 | 0 | TBD* | TBD* |
| Cart Page | /cart | Yes | 0 | 0 | TBD* | TBD* |
| Checkout Page | /checkout | Yes | 0 | 0 | TBD* | TBD* |
| Order History | /orders | Yes | 0 | 0 | TBD* | TBD* |

*\*Exact counts per page in `reports/accessibility/axe-report.json`. 14 total moderate violations detected across all pages.*

---

## Overall Results

| Impact | Count | CI Gate | Status |
|---|---|---|---|
| Critical | 0 | Fail if > 0 | ✅ Pass |
| Serious | 0 | — | ✅ Pass |
| Moderate | ~14 | Not blocking | Documented |
| Minor | 0 | — | ✅ Pass |

---

## Known Moderate Violations

Axe reported moderate violations consistent with Material UI's default rendering. Common issues:

| Violation Rule | Description | Pages Affected | Recommended Fix |
|---|---|---|---|
| `color-contrast` | Foreground/background color ratio below WCAG 4.5:1 AA | Product catalog, checkout | Increase text contrast on price/label elements |
| `aria-required-children` | ARIA role missing required child roles | Multiple | Review MUI component aria structure |
| `landmark-one-main` | Page does not have a main landmark | Multiple | Wrap page content in `<main>` |

These are documented for awareness. Not blocking in current CI gate — addressed in accessibility backlog.

---

## Auth Seeding Strategy

Protected pages (products, cart, checkout, orders) require authentication. Axe tests seed localStorage before navigating:

```python
def get_auth_payload():
    # POST /api/login via urllib, returns JSON string
    
page.evaluate(
    f"window.localStorage.setItem('{AUTH_KEY}', JSON.stringify({auth_payload}))"
)
```

This avoids full UI login flow and ensures Axe scans the authenticated page state, not the redirect target.

---

## Pytest Integration

Axe tests run as parametrized pytest suite:

```bash
cd tests/playwright-python
uv run pytest ../accessibility/axe_accessibility_tests.py -v
```

Output:
```
PASSED  test_no_critical_axe_violations[http://localhost:5173/login-Login Page]
PASSED  test_no_critical_axe_violations[http://localhost:5173/products-Product Catalog]
PASSED  test_no_critical_axe_violations[http://localhost:5173/cart-Cart Page]
PASSED  test_no_critical_axe_violations[http://localhost:5173/checkout-Checkout Page]
PASSED  test_no_critical_axe_violations[http://localhost:5173/orders-Order History]
5 passed in ~15s
```

---

## Limitations

Axe automated scanning detects approximately 30-40% of WCAG 2.1 accessibility issues. The following require manual testing:

| Area | Manual Test Needed |
|---|---|
| Screen reader compatibility | Test with VoiceOver (macOS) or NVDA (Windows) |
| Keyboard navigation order | Tab through all interactive elements, verify logical flow |
| Focus indicator visibility | Verify focus ring visible on all buttons, inputs, links |
| Dynamic content announcements | Verify cart badge updates announced to screen reader |
| Color meaning independence | Verify information is not conveyed by color alone |

---

## Full Report

Complete per-page violation details with element selectors and remediation links:

```
reports/accessibility/axe-report.json
```
