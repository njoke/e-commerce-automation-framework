# TestSprite Defect Log — Amplifii Electronics

Defects discovered during TestSprite exploratory sessions and AI-assisted testing. Each Critical/High defect is converted to an automated regression test.

---

## Defect Format

```
DEF-XXX | Title
Severity: Critical / High / Medium / Low
Status: Open / Fixed / Won't Fix / Deferred
Found by: TestSprite Session N / Manual
Steps to Reproduce: ...
Expected: ...
Actual: ...
Regression: Playwright test_*.py / Postman assertion / N/A
```

---

## Defects

---

### DEF-001 | Auth state lost on page reload — user redirected to login

**Severity:** High  
**Status:** Fixed  
**Found by:** TestSprite Session 2 (exploratory — browser refresh during product browsing)

**Steps to Reproduce:**
1. Log in as `standard_user`
2. Navigate to `/products`
3. Press F5 / Cmd+R to reload the page

**Expected:** User remains authenticated, products page loads normally  
**Actual:** User redirected to `/login` — React auth context resets on reload

**Root Cause:** `AuthContext` stored user state in React memory only — no persistence across page reloads.

**Fix Applied:** Added `localStorage` persistence to `AuthContext` — `login()` writes to `localStorage`, `logout()` clears it, initial state loaded from `localStorage` on mount.

**Regression:** `test_smoke.py::test_full_purchase_flow` — uses `page.goto()` to navigate between pages (triggers reload), verifies auth persists.

---

### DEF-002 | Backend orders route mounted at wrong path — checkout 404

**Severity:** Critical  
**Status:** Fixed  
**Found by:** Manual testing during Phase 3 integration

**Steps to Reproduce:**
1. Log in, add item to cart
2. Complete checkout form and submit
3. Observe network request to `/api/orders/checkout`

**Expected:** `POST /api/checkout` returns 201 with order  
**Actual:** 404 Not Found — endpoint resolved to `/api/orders/checkout` instead of `/api/checkout`

**Root Cause:** `server.js` mounted orders router at `/api/orders`, but spec requires `/api/checkout` and `/api/orders` as separate top-level paths.

**Fix Applied:** Changed mount from `app.use('/api/orders', ...)` to `app.use('/api', ...)` with internal routes `/checkout` and `/orders`.

**Regression:** Postman collection `POST /api/checkout - Valid checkout` — asserts 201 and `orderId` present.

---

### DEF-003 | Empty cart checkout proceeds without error on frontend

**Severity:** High  
**Status:** Fixed  
**Found by:** TestSprite Session 3 (TS-029)

**Steps to Reproduce:**
1. Log in as `standard_user`
2. Navigate directly to `/checkout` (skip adding items to cart)
3. Fill checkout form and submit

**Expected:** Error message: "Your cart is empty. Add items before checking out."  
**Actual (before fix):** Checkout submitted with empty items array — API returned 400 but UI showed no clear error

**Fix Applied:** Backend returns 400 with descriptive error. Frontend `CheckoutPage` displays `apiError` in `ErrorAlert` component when `order.error` is returned.

**Regression:** `test_checkout.py::test_empty_form_does_not_submit` covers form guard. Postman `POST /api/checkout - Empty cart 400` covers API guard.

---

### DEF-004 | Cart badge shows empty string when cart count is 0

**Severity:** Low  
**Status:** Won't Fix (by design)  
**Found by:** TestSprite Session 3 — cart badge inspection

**Steps to Reproduce:**
1. Log in with empty cart
2. Inspect `[data-testid="cart-icon-badge"]` inner text

**Expected:** Badge shows "0" or is not visible when cart is empty  
**Actual:** MUI Badge renders with empty inner text when `badgeContent` is 0 — `inner_text()` returns `""`

**Decision:** MUI Badge hides the badge pill when count is 0 by default — this is correct UX behavior. Not a defect.

**Regression:** `test_cart.py::test_add_item_updates_cart_badge` — handles empty badge text with `isdigit()` guard.

---

### DEF-005 | MUI Select `data-testid` placed on hidden native input — Playwright `select_option()` fails

**Severity:** Medium  
**Status:** Fixed (test workaround)  
**Found by:** TestSprite Session 1 test generation — identified during Playwright implementation

**Steps to Reproduce:**
1. Playwright test calls `select_option("price_asc")` on `[data-testid="product-sort-select"]`
2. Element resolved is `<input aria-hidden="true" class="MuiSelect-nativeInput" />`
3. Error: `Element is not a <select> element`

**Expected:** Sort dropdown changes to "Price: Low to High"  
**Actual:** `playwright._impl._errors.Error: Locator.select_option: Error: Element is not a <select> element`

**Root Cause:** MUI `<Select>` with `inputProps={{ 'data-testid': ... }}` puts the testid on the hidden native input, not the visible combobox div.

**Fix Applied:** Test workaround — `products_page.py` uses `page.locator('[aria-labelledby="sort-label"]').click()` then `page.locator(f'li[data-value="{value}"]').click()` to interact with the MUI Select correctly.

**Regression:** `test_products.py::test_sort_price_asc` and `test_sort_price_desc` — both now pass.

---

### DEF-006 | Checkout form missing `cardNumber` field in test fixture causes validation failure

**Severity:** Medium  
**Status:** Fixed  
**Found by:** TestSprite Session 3 — checkout test execution

**Steps to Reproduce:**
1. Run `test_checkout.py::test_valid_checkout_shows_confirmation`
2. Checkout form submitted without `cardNumber`
3. Frontend validation rejects form — stays on `/checkout`
4. `page.wait_for_url("**/confirmation")` times out

**Expected:** Checkout succeeds and navigates to `/confirmation`  
**Actual:** Timeout — `cardNumber` is required by frontend validation but missing from test fixture

**Fix Applied:** Added `"cardNumber": "4111111111111111"` to `fixtures/checkout_data.json`. Added `card_number` field to `CheckoutPage` page object.

**Regression:** All checkout tests now pass with complete form data.

---

## Defect Summary

| ID | Title | Severity | Status |
|---|---|---|---|
| DEF-001 | Auth state lost on page reload | High | Fixed |
| DEF-002 | Orders route mounted at wrong path | Critical | Fixed |
| DEF-003 | Empty cart checkout proceeds without error | High | Fixed |
| DEF-004 | Cart badge empty string when count 0 | Low | Won't Fix |
| DEF-005 | MUI Select testid on hidden input | Medium | Fixed (workaround) |
| DEF-006 | Missing cardNumber in checkout fixture | Medium | Fixed |

**Critical fixed:** 1  
**High fixed:** 2  
**Medium fixed/worked around:** 2  
**Won't Fix:** 1
