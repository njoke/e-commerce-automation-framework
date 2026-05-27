# Performance Test Summary — Amplifii Electronics

**Tool:** k6 v2.0.0  
**Run Date:** 2026-05-27  
**Environment:** Local Docker (Node.js + Nginx containers)  
**Result:** PASS — all thresholds met across all 3 scripts

---

## Test Scripts

| Script | File | Purpose |
|---|---|---|
| Product API Smoke | `tests/performance/product_api_smoke_test.js` | Baseline load on product catalog |
| Checkout Load Test | `tests/performance/checkout_api_load_test.js` | Sustained load on checkout endpoint |
| API Spike Test | `tests/performance/api_spike_test.js` | Spike traffic on health endpoint |

---

## Results

### 1. Product API Smoke Test

**Config:** 5 VUs, 30 seconds

| Metric | Result | Threshold | Status |
|---|---|---|---|
| p(95) response time | 27.35ms | < 500ms | ✅ Pass |
| Error rate | 0.00% | < 1% | ✅ Pass |
| Total requests | 150 | — | — |
| Throughput | ~5 req/s | — | — |
| Checks passed | 300/300 (100%) | — | ✅ |

**Checks:**
- `status is 200` — 100%
- `has products` (response array non-empty) — 100%

---

### 2. Checkout API Load Test

**Config:** 10 VUs, 30 seconds

| Metric | Result | Threshold | Status |
|---|---|---|---|
| p(95) response time | 16.11ms | < 800ms | ✅ Pass |
| Error rate | 0.00% | < 1% | ✅ Pass |
| Total requests | 300 | — | — |
| Throughput | ~10 req/s | — | — |
| Checks passed | 300/300 (100%) | — | ✅ |

**Checks:**
- `status is 201` — 100%

---

### 3. API Spike Test

**Config:** 0 → 20 → 0 VUs over 20 seconds

| Metric | Result | Threshold | Status |
|---|---|---|---|
| p(95) response time | 31.51ms | — | — |
| Error rate | 0.00% | < 5% | ✅ Pass |
| Total requests | 12,801 | — | — |
| Peak throughput | ~640 req/s | — | — |
| Checks passed | 12,801/12,801 (100%) | — | ✅ |

**Checks:**
- `status is 200` (health endpoint) — 100%

---

## Observations

**Product API (GET /api/products):**
- Median response time 4.5ms — very fast for JSON file-backed endpoint
- p(95) at 27ms well within 500ms threshold
- No errors across 150 requests

**Checkout API (POST /api/checkout):**
- Median response time 3.3ms — faster than product API due to simpler JSON write path
- p(95) at 16ms — threshold of 800ms is comfortably met
- All 300 checkout requests returned 201 (each creates a real order in JSON store)

**Spike Test (GET /api/health):**
- 12,801 requests in 20 seconds at peak 640 req/s — Node.js handles spike well
- 0 errors — no connection exhaustion or timeouts under sudden load ramp

---

## Limitations

| Limitation | Notes |
|---|---|
| Local Docker environment | Results will differ on Render free tier (shared CPU, cold start) |
| JSON file backend | File I/O under concurrent writes could degrade at higher VUs — not tested |
| No VU > 20 tested | Enterprise scale out of scope for portfolio project |
| Checkout test creates real orders | JSON data grows with each run; restart Docker to reset |

---

## Run Commands

```bash
# Smoke
k6 run tests/performance/product_api_smoke_test.js

# Load
k6 run tests/performance/checkout_api_load_test.js

# Spike
k6 run tests/performance/api_spike_test.js

# Save JSON output for reporting
k6 run --out json=reports/k6/results.json tests/performance/product_api_smoke_test.js
```

---

## CI Integration

The `k6-performance.yml` GitHub Actions workflow is triggered manually (`workflow_dispatch`). This avoids running 30-second performance tests on every PR while keeping them accessible for on-demand execution.

```bash
# Trigger from GitHub Actions UI: Actions → k6 Performance Smoke Test → Run workflow
```
