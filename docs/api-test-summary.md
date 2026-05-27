# API Test Summary — Amplifii Electronics

**Tool:** Postman + Newman  
**Collection:** `tests/postman/ecommerce-api.postman_collection.json`  
**Environment:** `tests/postman/ecommerce-local.postman_environment.json`  
**Run Date:** 2026-05-27  
**Result:** PASS — 0 failures

---

## Coverage Overview

| Category | Requests | Assertions | Result |
|---|---|---|---|
| Health | 1 | 2 | ✅ Pass |
| Authentication | 5 | 14 | ✅ Pass |
| Products | 5 | 18 | ✅ Pass |
| Cart | 8 | 13 | ✅ Pass |
| Orders | 5 | 8 | ✅ Pass |
| **Total** | **24** | **55** | **✅ Pass** |

---

## Endpoints Tested

### Health

| Method | Endpoint | Test | Expected | Result |
|---|---|---|---|---|
| GET | /api/health | Status code | 200 | ✅ |
| GET | /api/health | Body has status "ok" | `{ "status": "ok" }` | ✅ |

### Authentication — POST /api/login

| Scenario | Expected Status | Key Assertions | Result |
|---|---|---|---|
| Valid credentials (standard_user) | 200 | has userId, username, token | ✅ |
| Invalid password | 401 | has error message | ✅ |
| Locked user | 403 | has error message | ✅ |
| Missing body | 400 | status 400 | ✅ |
| SQL injection in username | 401 | does not return token | ✅ |

**Chain:** Login saves `userId` and `token` to environment variables for downstream cart/order requests.

### Products

| Method | Endpoint | Scenario | Expected | Result |
|---|---|---|---|---|
| GET | /api/products | All products | 200, array length >= 1 | ✅ |
| GET | /api/products | Schema validation | id, name, price, category, inStock | ✅ |
| GET | /api/products?search=headphone | Search filter | 200, results contain "headphone" | ✅ |
| GET | /api/products/:id | Valid product | 200, has id and name | ✅ |
| GET | /api/products/:id | Invalid product ID | 404 | ✅ |

### Cart

| Method | Endpoint | Scenario | Expected | Result |
|---|---|---|---|---|
| POST | /api/cart | Add valid product qty 1 | 201, has id | ✅ |
| POST | /api/cart | Add valid product qty 2 | 201 | ✅ |
| POST | /api/cart | Add non-existent product | 404 | ✅ |
| POST | /api/cart | Add qty 0 | 400 | ✅ |
| POST | /api/cart | Add qty -1 | 400 | ✅ |
| GET | /api/cart | Get cart items | 200, array | ✅ |
| PUT | /api/cart/:itemId | Update qty to 3 | 200 | ✅ |
| DELETE | /api/cart/:itemId | Remove item | 200 | ✅ |

**Chain:** `POST /api/cart` saves `cartItemId` for PUT and DELETE requests.

### Orders

| Method | Endpoint | Scenario | Expected | Result |
|---|---|---|---|---|
| POST | /api/checkout | Valid checkout | 201, has orderId | ✅ |
| POST | /api/checkout | Empty items array | 400 | ✅ |
| POST | /api/checkout | Missing email | 400 | ✅ |
| GET | /api/orders | Get orders | 200, array | ✅ |
| GET | /api/orders | Order has required fields | orderId, userId, items, total | ✅ |

---

## Newman Run Output Summary

```
┌─────────────────────────┬──────────────────────┬──────────────────────┐
│                         │             executed │               failed │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│              iterations │                    1 │                    0 │
│                requests │                   24 │                    0 │
│            test-scripts │                   24 │                    0 │
│      prerequest-scripts │                    0 │                    0 │
│              assertions │                   55 │                    0 │
└─────────────────────────┴──────────────────────┴──────────────────────┘
run duration: ~3.5s
```

---

## Key Design Decisions

**Request chaining:** Login → add-to-cart → checkout are chained using Postman environment variables. Each step saves state (`userId`, `token`, `cartItemId`) for use by subsequent requests.

**Assertion style:** `pm.expect(json).to.include.all.keys(...)` used for subset key matching (not `have.all.keys` which requires exact match). This future-proofs assertions against additive API changes.

**Query param URLs:** String URL format used for search requests (e.g., `"url": "{{baseUrl}}/api/products?search=headphone"`) — object format causes Newman to lose the host.

---

## Deployed Environment Testing

Run against Render-hosted backend:

```bash
newman run tests/postman/ecommerce-api.postman_collection.json \
  -e tests/postman/ecommerce-render.postman_environment.json
```

Note: Allow ~30s for Render cold start before running.
