# Traceability Matrix — Amplifii Electronics

Maps requirements to risk, test type, tool, and automation status.

---

| Requirement | Business Risk | Test Type | Tool | Test ID(s) | Status |
|---|---|---|---|---|---|
| User can log in with valid credentials | User blocked from shopping | UI + API | Playwright, Postman | test_login.py::test_valid_login, Postman: POST /api/login valid | Automated |
| Invalid login shows error message | Security bypass | UI + API | Playwright, Postman | test_login.py::test_invalid_password, Postman: POST /api/login invalid | Automated |
| Locked user sees locked message | Support burden | UI + API | Playwright, Postman | test_login.py::test_locked_user_shows_error, Postman: POST /api/login locked | Automated |
| Empty login fields show validation error | UX confusion | UI | Playwright | test_login.py::test_empty_fields_show_validation | Automated |
| Logout clears session and redirects | Data exposure | UI | Playwright | test_login.py::test_logout_redirects_to_login | Automated |
| Protected routes redirect unauthenticated users | Unauthorized access | UI | Playwright | test_login.py::test_unauthenticated_redirect | Automated |
| SQL injection in login does not bypass auth | Security breach | UI + API | Playwright, Postman | test_login.py::test_sql_injection_does_not_bypass | Automated |
| XSS payload in login does not execute | Security breach | UI | Playwright | test_login.py::test_xss_payload_does_not_execute | Automated |
| Products page displays all 4 products | Revenue loss | UI + API | Playwright, Postman | test_products.py::test_products_page_loads, Postman: GET /api/products | Automated |
| Product card shows name, price, Add to Cart | Broken catalog UX | UI | Playwright | test_products.py::test_product_card_has_add_to_cart_button | Automated |
| Search filters product list | Discovery friction | UI | Playwright | test_products.py::test_search_returns_matching_products | Automated |
| Search with no match shows empty state | Confusing UX | UI | Playwright | test_products.py::test_search_no_results_returns_empty | Automated |
| Sort price ascending works | Wrong purchase decisions | UI | Playwright | test_products.py::test_sort_price_asc | Automated |
| Sort price descending works | Wrong purchase decisions | UI | Playwright | test_products.py::test_sort_price_desc | Automated |
| Add to cart updates badge count | Cart state confusion | UI | Playwright | test_cart.py::test_add_item_updates_cart_badge | Automated |
| Cart shows added items with correct details | Revenue impact | UI + API | Playwright, Postman | test_cart.py::test_cart_shows_added_items, Postman: GET /api/cart | Automated |
| Remove item from cart reduces count | Incorrect totals | UI | Playwright | test_cart.py::test_remove_item_from_cart | Automated |
| Empty cart shows empty state | UX confusion | UI | Playwright | test_cart.py::test_empty_cart_shows_message | Automated |
| POST /api/cart invalid qty returns 400 | Bad data submitted | API | Postman | Postman: POST /api/cart qty 0, qty -1 | Automated |
| Checkout with valid fields creates order | Lost revenue | UI + API | Playwright, Postman | test_checkout.py::test_valid_checkout, Postman: POST /api/checkout valid | Automated |
| Checkout confirmation shows order ID | Order tracking | UI | Playwright | test_checkout.py::test_checkout_shows_order_id | Automated |
| Checkout with empty email shows error | Bad order data | UI | Playwright | test_checkout.py::test_missing_email_shows_error | Automated |
| Checkout with empty cart shows error | Ghost orders | UI + API | Playwright, Postman | test_checkout.py::test_empty_cart_checkout, Postman: POST /api/checkout empty | Automated |
| Order appears in history after checkout | User trust | UI + API | Playwright, Postman | test_order_history.py::test_order_appears_after_checkout, Postman: GET /api/orders | Automated |
| Empty order history shows empty state | UX confusion | UI | Playwright | test_order_history.py::test_empty_order_history | Automated |
| Full E2E purchase flow completes | Revenue impact | UI (smoke) | Playwright | test_smoke.py::test_full_purchase_flow | Automated |
| Pages meet accessibility standards | Users excluded | Accessibility | Axe + Manual | axe_accessibility_tests.py | Covered |
| APIs perform under load | Revenue impact | Performance | k6 | product_api_smoke_test.js | Covered |
| App runs in Docker | Setup friction | Infrastructure | Docker Compose | Manual: docker compose up --build | Verified |
| App deploys to Vercel/Render | Portfolio inaccessible | Deployment | Vercel + Render | Manual deployment | Pending |
