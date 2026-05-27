# TestSprite Test Data — Amplifii Electronics

AI-suggested test data variations for realistic and boundary testing across all application areas.

---

## Authentication Test Data

### Valid Users

| Username | Password | Role | Expected Result |
|---|---|---|---|
| `standard_user` | `secret_sauce` | standard | 200 — login success |
| `admin_user` | `admin_sauce` | admin | 200 — login success |

### Invalid / Edge Case Users

| Username | Password | Expected Status | Notes |
|---|---|---|---|
| `locked_user` | `secret_sauce` | 403 | Account locked |
| `standard_user` | `wrong_pass` | 401 | Invalid credentials |
| `no_such_user` | `secret_sauce` | 401 | User not found |
| `` (empty) | `` (empty) | 400 | Missing fields |
| `standard_user` | `` (empty) | 400 | Missing password |
| `' OR 1=1--` | `anything` | 401 | SQL injection — should not bypass auth |
| `<script>alert(1)</script>` | `secret_sauce` | 401 | XSS in username — should not execute |
| `user@example.com` | `secret_sauce` | 401 | Email format — app uses username not email |
| `STANDARD_USER` | `secret_sauce` | 401 | Case sensitivity check |
| `standard_user` | `SECRET_SAUCE` | 401 | Password case sensitivity |

---

## Product Search Test Data

| Search Term | Expected Result |
|---|---|
| `headphone` | Returns prod-001 (Amplifii X1 Pro Headphones) |
| `Earbuds` | Returns prod-002 (case-insensitive expected) |
| `speaker` | Returns prod-003 |
| `mic` | Returns prod-004 |
| `sound` | Returns multiple (earbuds description, speakers) |
| `xyz_not_real_999` | Returns 0 results — empty state |
| `` (empty) | Returns all 4 products |
| `<` | Returns 0 or all — no error thrown |
| `%` | Returns 0 or all — no error thrown |
| `   ` (whitespace) | Returns all or empty — trimmed |

---

## Cart Test Data

### Add to Cart Payloads

| productId | quantity | Expected Status | Notes |
|---|---|---|---|
| `prod-001` | 1 | 201 | Valid in-stock product |
| `prod-002` | 2 | 201 | Valid, qty 2 |
| `prod-004` | 1 | 201 | Out-of-stock — backend accepts, UI disables button |
| `prod-999` | 1 | 404 | Non-existent product |
| `prod-001` | 0 | 400 | Invalid quantity |
| `prod-001` | -1 | 400 | Negative quantity |
| `prod-001` | 999 | 201 | Large quantity — no max enforced |

### Cart Update Payloads

| quantity | Expected Status | Notes |
|---|---|---|
| 3 | 200 | Valid update |
| 1 | 200 | Reduce to 1 |
| 0 | 400 | Invalid — must be ≥ 1 |
| -5 | 400 | Invalid negative |
| `"three"` | 400 | String instead of number |

---

## Checkout Test Data

### Valid Checkout

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "address": "123 Elm Street",
  "city": "Seattle",
  "state": "WA",
  "zip": "98101",
  "cardNumber": "4111111111111111"
}
```

### Invalid / Edge Case Payloads

| Field | Bad Value | Expected Behavior |
|---|---|---|
| `email` | `""` (empty) | 400 — required |
| `email` | `notanemail` | 400 — invalid format |
| `email` | `a@b` | 400 — invalid format |
| `email` | `jane+test@example.co.uk` | 200 — valid complex email |
| `firstName` | `""` | 400 — required |
| `zip` | `ABC` | Backend accepts (no format validation) |
| `zip` | `""` | 400 — required |
| `cardNumber` | `""` | 400 — required |
| `items` | `[]` | 400 — empty cart |
| `items` | `[{productId: "prod-999", quantity: 1, price: 0}]` | Processes with $0 — no product validation on checkout |
| All fields | Very long strings (500 chars) | Should not crash server |

---

## Order History Test Data

| Scenario | Precondition | Expected |
|---|---|---|
| No orders | Fresh user, no checkouts | Empty state message visible |
| One order | Complete 1 checkout | Order visible in list with correct orderId |
| Multiple orders | Complete 3 checkouts | All 3 orders visible |
| Another user's orders | Login as `admin_user` | Only admin's orders shown (user-scoped) |

---

## API Header Test Data

| Header | Value | Endpoint | Expected |
|---|---|---|---|
| `x-user-id` | `user-001` | GET /api/cart | 200 — user cart |
| `x-user-id` | `user-999` | GET /api/cart | 200 — empty array (no cart for unknown user) |
| `x-user-id` | (missing) | GET /api/cart | 200 — empty array (no user context) |
| `Content-Type` | (missing) | POST /api/login | 400 — body not parsed |
