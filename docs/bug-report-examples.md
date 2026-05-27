# Bug Report Examples — Amplifii Electronics

Professional defect reports from the Amplifii Electronics QA automation project. These represent real defects discovered during development, TestSprite sessions, and automated test execution.

---

## BUG-001: Auth state lost on page reload — user redirected to login

**Status:** Closed (Fixed)  
**Severity:** High  
**Priority:** High  
**Detected By:** TestSprite Session 2 — exploratory browser refresh during product browsing  
**Environment:** Local Docker, Chrome, React + Node.js  
**Area:** Authentication  

### Description

After a successful login, reloading any protected page (e.g., `/products`) redirects the user back to `/login`, discarding their session without warning.

### Steps to Reproduce

1. Navigate to `http://localhost:5173/login`
2. Log in as `standard_user` / `secret_sauce`
3. Confirm redirect to `/products`
4. Press `F5` or `Cmd+R` to reload the page

### Expected Result

User remains authenticated. Products page reloads and displays product catalog.

### Actual Result

User is redirected to `/login`. All session state is lost. Cart and navigation state reset.

### Business Impact

Forces users to re-login on every page reload, breaking basic browsing patterns and destroying session continuity. High abandonment risk.

### Root Cause

`AuthContext` stored user and token in React component state (`useState`) only. State is not persisted across page reloads — React memory is reset on mount.

### Fix Applied

Added `localStorage` persistence to `AuthContext`:
- `login()` writes `{ user, token }` to `localStorage` under key `amplifii_auth`
- `logout()` removes the key
- Initial state is loaded from `localStorage` on component mount via `loadAuth()`

### Regression Test

`test_smoke.py::test_full_purchase_flow` — navigates between pages via `page.goto()` (equivalent to reload), verifies auth persists throughout flow.

---

## BUG-002: Backend orders route mounted at wrong path — checkout returns 404

**Status:** Closed (Fixed)  
**Severity:** Critical  
**Priority:** Critical  
**Detected By:** Manual integration testing — Phase 3  
**Environment:** Local, all browsers  
**Area:** Checkout / Orders API  

### Description

Completing the checkout form and submitting results in a 404 Not Found error. No order is created.

### Steps to Reproduce

1. Log in as `standard_user`
2. Add `Amplifii X1 Pro Headphones` to cart
3. Navigate to `/checkout`
4. Fill all required fields with valid data
5. Click **Place Order**
6. Observe network request in browser DevTools

### Expected Result

`POST /api/checkout` returns HTTP 201 with `orderId`. User redirected to `/confirmation`.

### Actual Result

`POST /api/checkout` returns HTTP 404 Not Found. User remains on checkout page. No confirmation displayed.

### Business Impact

Complete checkout flow is broken. Zero orders can be placed. Critical revenue blocker.

### Root Cause

`server.js` mounted the orders router at `/api/orders`:
```javascript
app.use('/api/orders', ordersRouter);
```
This caused `POST /api/checkout` to resolve to `/api/orders/checkout` (not found), and `GET /api/orders` to resolve to `/api/orders/orders` (also not found).

### Fix Applied

Changed mount path to `/api` and defined checkout and orders as separate routes internally:
```javascript
app.use('/api', ordersRouter);
// Internal routes: POST /checkout, GET /orders
```

### Regression Test

Postman collection: `POST /api/checkout - Valid checkout` — asserts HTTP 201 and `orderId` present in response body.

---

## BUG-003: Empty cart checkout proceeds without user-facing error

**Status:** Closed (Fixed)  
**Severity:** High  
**Priority:** High  
**Detected By:** TestSprite Session 3 (TS-029)  
**Environment:** Local Docker, Chrome  
**Area:** Checkout  

### Description

Navigating directly to `/checkout` without adding items to cart, then submitting the checkout form, does not show a meaningful error to the user. The form submits, the API returns 400, but the UI provides no feedback.

### Steps to Reproduce

1. Log in as `standard_user`
2. Navigate directly to `http://localhost:5173/checkout` (do not add items to cart)
3. Fill all checkout fields with valid data
4. Click **Place Order**

### Expected Result

Error message displayed: "Your cart is empty. Add items before checking out."

### Actual Result

Before fix: API returns 400 but UI showed no error state. User left on checkout page with no feedback.

### Business Impact

Users confused by silent failure. Support tickets increase. Potential for ghost order attempts.

### Fix Applied

1. Backend: `/api/checkout` now returns `400 { error: "Cart is empty" }` when `items` array is empty or missing
2. Frontend `CheckoutPage`: reads `order.error` from Redux/context state and renders it in `<ErrorAlert>` component with `role="alert"`

### Regression Test

- `test_checkout.py::test_empty_form_does_not_submit` — Playwright test verifies error shown on empty cart checkout
- Postman: `POST /api/checkout - Empty cart 400` — asserts 400 status and error message in body

---

## BUG-004: MUI Select `data-testid` placed on hidden native input — Playwright `select_option()` fails

**Status:** Closed (Workaround)  
**Severity:** Medium  
**Priority:** Medium  
**Detected By:** TestSprite Session 1 test generation — identified during Playwright implementation  
**Environment:** Local, Playwright test execution  
**Area:** Test Automation / Product Sort UI  

### Description

Playwright `select_option()` call on the product sort dropdown fails with `Error: Element is not a <select> element`. The sort dropdown is not interactable via standard Playwright API.

### Steps to Reproduce

1. In Playwright test, locate sort dropdown: `page.get_by_test_id("product-sort-select")`
2. Call `element.select_option("price_asc")`
3. Observe error

### Expected Result

Sort dropdown changes to "Price: Low to High". Product list reorders.

### Actual Result

```
playwright._impl._errors.Error: Locator.select_option: Error: Element is not a <select> element
```

### Root Cause

MUI `<Select>` component with `inputProps={{ 'data-testid': 'product-sort-select' }}` attaches the testid to the hidden native `<input aria-hidden="true" class="MuiSelect-nativeInput" />`, not the visible combobox div. `select_option()` requires an actual `<select>` element.

### Fix Applied (Test Workaround)

Updated `products_page.py` page object to use MUI-compatible interaction pattern:
```python
def sort_by(self, value):
    self.page.locator('[aria-labelledby="sort-label"]').click()
    self.page.locator(f'li[data-value="{value}"]').click()
    self.wait_for_products_or_empty()
```

### Regression Test

`test_products.py::test_sort_price_asc` and `test_sort_price_desc` — both pass with workaround.

---

## BUG-005: Checkout form missing `cardNumber` field in test fixture causes validation timeout

**Status:** Closed (Fixed)  
**Severity:** Medium  
**Priority:** High  
**Detected By:** TestSprite Session 3 — checkout test execution  
**Environment:** Local, Playwright  
**Area:** Test Automation / Checkout  

### Description

Playwright checkout test times out waiting for redirect to `/confirmation`. Form submission is silently blocked by frontend validation because `cardNumber` is missing from the test fixture.

### Steps to Reproduce

1. Run `uv run pytest specs/test_checkout.py::test_valid_checkout_shows_confirmation`
2. Test fills all fields except `cardNumber` (not in fixture at the time)
3. Clicks **Place Order**
4. `page.wait_for_url("**/confirmation")` waits indefinitely

### Expected Result

Test passes — form submits, order created, user navigated to `/confirmation`.

### Actual Result

```
playwright._impl._errors.TimeoutError: page.wait_for_url: Timeout 30000ms exceeded.
```
Frontend validation blocks submission because `cardNumber` is required but absent.

### Root Cause

`fixtures/checkout_data.json` did not include `cardNumber` field. `CheckoutPage` page object had no `card_number` locator. Frontend `CheckoutPage` component validates `cardNumber` as required before allowing submission.

### Fix Applied

1. Added `"cardNumber": "4111111111111111"` to `fixtures/checkout_data.json` (valid and missing_email variants)
2. Added `self.card_number = page.get_by_test_id("checkout-card-number-input")` to `CheckoutPage`
3. Added `card_number.fill()` call in `fill_form()` method with conditional check

### Regression Test

All checkout tests now pass with complete form data.
