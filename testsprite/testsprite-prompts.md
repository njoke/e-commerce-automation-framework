# TestSprite Prompts — Amplifii Electronics

Exact prompts submitted to TestSprite during each session.

---

## Session 1 — Test Scenario Generation

**Prompt:**

```
Act as an AI QA testing agent for the Full-Stack E-Commerce QA Automation Framework (Amplifii Electronics).

Application areas to test:
- Login and logout
- Product catalog (list, search, filter by category, sort by price)
- Product detail page
- Shopping cart (add, remove, update quantity)
- Checkout (form validation, order summary, card number field)
- Order confirmation page
- Order history page
- API error handling (400, 401, 403, 404 responses)
- Responsive behavior
- Accessibility risks

Application credentials:
- standard_user / secret_sauce → valid login
- locked_user / secret_sauce → returns 403 locked error
- admin_user / admin_sauce → valid admin login

Backend API base URL: http://localhost:3001
Frontend URL: http://localhost:5173

Generate high-priority functional, negative, edge-case, accessibility, API, and regression test scenarios.

For each scenario include:
- Scenario ID (TS-XXX)
- Test objective
- Preconditions
- Test steps
- Expected result
- Priority (Critical / High / Medium / Low)
- Risk area
- Suggested automation tool (Playwright / Postman / Manual)
```

---

## Session 2 — Exploratory Focus: Login + Product Catalog

**Prompt:**

```
Perform exploratory testing on the Login and Product Catalog pages of Amplifii Electronics.

Login URL: http://localhost:5173/login
Product Catalog URL: http://localhost:5173/products

Focus areas:
1. Attempt login with SQL injection strings in username/password fields
2. Attempt login with XSS payloads in form fields
3. Test search with special characters: <, >, ", ', &, %, null, 0
4. Test sort behavior with only one product in results
5. Test category filter with no matching products
6. Test browser back button behavior after login
7. Test direct URL navigation to /products without login

Report all unexpected behaviors, UI glitches, or error message inconsistencies.
```

---

## Session 3 — Exploratory Focus: Cart + Checkout

**Prompt:**

```
Perform exploratory testing on the Shopping Cart and Checkout pages of Amplifii Electronics.

Cart URL: http://localhost:5173/cart
Checkout URL: http://localhost:5173/checkout

Focus areas:
1. Add same product multiple times — does quantity update or duplicate?
2. Update cart quantity to very large number (999, 9999)
3. Attempt checkout with empty cart — expect error
4. Submit checkout form with all fields blank
5. Submit checkout form with invalid email format (e.g., "notanemail")
6. Submit checkout form with very long strings in each field
7. Navigate directly to /checkout without adding items to cart
8. Navigate directly to /confirmation without completing checkout
9. Test browser refresh on /confirmation page
10. Test checkout with out-of-stock product in cart (if possible)

Report defects with steps to reproduce, expected vs actual results, and severity.
```

---

## Session 4 — Accessibility Focus

**Prompt:**

```
Perform accessibility testing on all pages of Amplifii Electronics.

Pages to test:
- /login
- /products
- /cart
- /checkout
- /confirmation
- /orders

Check for:
1. All inputs have associated labels or aria-label
2. All buttons have accessible names
3. All images have alt text
4. Heading hierarchy is logical (h1 → h2 → h3, no skipped levels)
5. Error messages have role="alert" and are announced by screen readers
6. Form validation errors are associated with their inputs via aria-describedby
7. Tab order is logical across all pages
8. Color contrast meets WCAG 2.1 AA minimum (4.5:1 for text)
9. Focus indicator is visible on all interactive elements
10. Modal/dropdown focus trapping (if applicable)

Report violations with impact level (Critical / Serious / Moderate / Minor).
```

---

## Session 5 — API Edge Cases

**Prompt:**

```
Generate edge case test scenarios for the Amplifii Electronics REST API.

Backend base URL: http://localhost:3001

Endpoints to target:
- POST /api/login
- GET /api/products
- POST /api/cart
- PUT /api/cart/:itemId
- DELETE /api/cart/:itemId
- POST /api/checkout
- GET /api/orders

Edge cases to explore:
1. Login with username that is a valid email format
2. Login with password containing special characters
3. Add product to cart without x-user-id header
4. Add duplicate product to cart — expect quantity merge not duplication
5. PUT cart item with negative quantity
6. PUT cart item with quantity as string instead of number
7. DELETE cart item that does not exist
8. Checkout with items array containing invalid productId
9. Checkout with negative item quantity
10. GET /api/orders without x-user-id header

For each: expected HTTP status, expected response body shape, and suggested Postman test assertion.
```
