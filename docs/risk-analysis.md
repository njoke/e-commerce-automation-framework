# Risk Analysis — Amplifii Electronics

Risk-based assessment of functional, technical, and infrastructure risks. Higher-risk areas receive proportionally greater test coverage.

---

## Risk Rating Scale

| Rating | Likelihood | Impact | Score |
|---|---|---|---|
| Critical | High | Revenue loss / security breach | 5 |
| High | Medium-High | Core feature unusable | 4 |
| Medium | Medium | Degraded UX, workaround exists | 3 |
| Low | Low | Minor UX issue | 1-2 |

---

## Functional Risks

| Risk | Area | Likelihood | Impact | Rating | Mitigation |
|---|---|---|---|---|---|
| Login bypass via SQL injection | Authentication | Low | Critical | 5 | Automated negative test (Playwright + Postman) |
| Auth state lost on reload | Authentication | Medium | High | 4 | Fixed — localStorage persistence. Regression in test_smoke.py |
| Checkout endpoint misconfigured | Orders | Medium | Critical | 5 | Fixed (DEF-002). Newman regression asserts 201 on POST /api/checkout |
| Empty cart checkout accepted silently | Orders | Medium | High | 4 | Fixed (DEF-003). Frontend shows error, API returns 400 |
| Cart total incorrect after quantity change | Cart | Low | High | 4 | test_cart.py covers add/remove/badge update |
| Product data missing required fields | Catalog | Low | Medium | 3 | Postman schema validation on GET /api/products |
| Search returns incorrect results | Catalog | Low | Medium | 3 | test_products.py search tests |
| Sort order incorrect | Catalog | Low | Medium | 3 | test_products.py sort asc/desc |
| XSS payload executed in UI | Security | Low | Critical | 5 | Automated negative login test |
| Order history shows wrong user orders | Privacy | Low | High | 4 | Manual test — API uses x-user-id scoping |

---

## Technical Risks

| Risk | Component | Likelihood | Impact | Rating | Mitigation |
|---|---|---|---|---|---|
| MUI component selector instability | Frontend selectors | Medium | Medium | 3 | Use data-testid + aria-labelledby; avoid CSS class selectors |
| JSON file data corruption under concurrent write | Backend data | Medium | High | 4 | Accepted for portfolio scope — documented limitation |
| Playwright timing failures in CI | Test reliability | Medium | Medium | 3 | networkidle waits + explicit selectors on all page transitions |
| Docker image build fails on Node version change | Infrastructure | Low | Medium | 3 | Pinned Node 20 in Dockerfiles |
| Render cold start delays Postman CI tests | CI reliability | High | Medium | 3 | sleep 5 before Newman run; Render env documented |
| uv.lock out of sync | Test deps | Low | Medium | 3 | uv.lock committed; CI uses uv sync |

---

## Accessibility Risks

| Risk | Impact | Axe Detection | Status |
|---|---|---|---|
| Missing aria-label on password input | Screen reader users can't identify field | Yes | Check axe-report.json |
| Error messages not announced (role=alert) | User unaware of validation failure | Yes | Check axe-report.json |
| Color contrast below WCAG 4.5:1 | Low-vision users cannot read content | Yes | Check axe-report.json |
| Tab order skips filter controls | Keyboard-only users cannot use filters | No (manual) | Manual test recommended |
| Focus indicator invisible | Keyboard navigation impossible | Yes | Check axe-report.json |

---

## Performance Risks

| Risk | Threshold | k6 Result | Status |
|---|---|---|---|
| Product API slow under load | p(95) < 500ms | p(95) = 27ms @ 5 VUs | ✅ Passes |
| Checkout API slow under load | p(95) < 800ms | p(95) = 16ms @ 10 VUs | ✅ Passes |
| API fails under spike traffic | error_rate < 5% | 0% @ 0→20 VUs | ✅ Passes |

**Note:** Results reflect Docker local environment. Render free tier performance will vary.

---

## Infrastructure Risks

| Risk | Mitigation |
|---|---|
| Render free tier spins down | Documented in README — ~30s cold start expected |
| Secrets committed to repo | .gitignore covers .env files; .env.example committed |
| Docker build context too large | .dockerignore in frontend/ and backend/ |
| GitHub Actions runner resource limits | Lightweight tests only in CI; k6 is manual-trigger |
