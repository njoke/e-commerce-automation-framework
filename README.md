# Amplifii Electronics — Full-Stack E-Commerce QA Automation Framework

Quality Assurance Engineering project demonstrating end-to-end test automation on an e-commerce application, covering UI automation, API testing, AI-assisted testing, accessibility auditing, performance testing, and CI/CD.

![Frontend Quality](https://github.com/njoke/e-commerce-automation-framework/actions/workflows/frontend-quality.yml/badge.svg)
![Playwright Tests](https://github.com/njoke/e-commerce-automation-framework/actions/workflows/playwright-python.yml/badge.svg)
![Postman API Tests](https://github.com/njoke/e-commerce-automation-framework/actions/workflows/postman-api-tests.yml/badge.svg)
![k6 Performance](https://github.com/njoke/e-commerce-automation-framework/actions/workflows/k6-performance.yml/badge.svg)

---

## Live Demo

| Service | URL |
|---|---|
| Frontend (Vercel) | https://e-commerce-automation-framework.vercel.app|
| Backend API (Render) | https://amplifii-backend.onrender.com/api/health|

> Note: Backend on Render free tier — may take ~30s to wake after inactivity (cold start). Expected behavior.

---

## Tech Stack

| Area | Tool |
|---|---|
| Frontend | React + TypeScript + Vite + Material UI |
| Backend | Node.js + Express.js |
| Data Store | Local JSON files |
| UI Automation | Playwright + Python (uv) |
| API Testing | Postman + Newman |
| AI Testing | TestSprite |
| Accessibility | Axe / axe-playwright-python |
| Performance | k6 |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Quick Start — Docker (Recommended)

```bash
git clone https://github.com/njoke/e-commerce-automation-framework.git
cd e-commerce-automation-framework
cp frontend/.env.example frontend/.env
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/api/health |

---

## Manual Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## Test Credentials

| User | Username | Password | Role |
|---|---|---|---|
| Standard | `standard_user` | `secret_sauce` | Full access |
| Locked | `locked_user` | `secret_sauce` | Login blocked (403) |
| Admin | `admin_user` | `admin_sauce` | Admin role |

---

## Running Tests

### Playwright UI Tests (uv)

```bash
cd tests/playwright-python
uv sync
uv run playwright install
uv run pytest -v
uv run pytest specs/test_smoke.py -v          # smoke only
uv run pytest --html=../../reports/playwright/report.html -v
```

### Postman API Tests (Newman)

```bash
newman run tests/postman/ecommerce-api.postman_collection.json \
  -e tests/postman/ecommerce-local.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/postman/report.html
```

### Accessibility Tests (Axe)

```bash
cd tests/playwright-python
uv run python ../accessibility/axe_accessibility_tests.py
# or via pytest:
uv run pytest ../accessibility/axe_accessibility_tests.py -v
```

### Performance Tests (k6)

```bash
# Requires both Docker services running
k6 run tests/performance/product_api_smoke_test.js
k6 run tests/performance/checkout_api_load_test.js
k6 run tests/performance/api_spike_test.js
```

---

## QA Coverage

| Layer | Tool | Tests | Status |
|---|---|---|---|
| UI Automation | Playwright + Python | 30+ test cases across 6 suites | ✅ Passing |
| API Testing | Postman + Newman | 24 requests, 55 assertions | ✅ Passing |
| AI Testing | TestSprite | 50 scenarios generated, 6 defects logged | ✅ Complete |
| Accessibility | Axe | 5 pages scanned, 0 critical violations | ✅ Passing |
| Performance | k6 | Smoke + load + spike tests, all thresholds met | ✅ Passing |
| CI/CD | GitHub Actions | 5 workflows (lint, API, Playwright, Postman, k6) | ✅ Configured |

---

## Project Structure

```
e-commerce-automation-framework/
├── frontend/                   # React + TypeScript + Vite app
├── backend/                    # Node.js + Express API
├── tests/
│   ├── playwright-python/      # Playwright tests (uv)
│   ├── postman/                # Postman collection + environments
│   ├── accessibility/          # Axe accessibility scan
│   └── performance/            # k6 performance scripts
├── testsprite/                 # AI testing workflow artifacts
├── docs/                       # QA documentation suite
├── reports/                    # Test evidence and screenshots
├── .github/workflows/          # GitHub Actions CI/CD
├── docker-compose.yml
└── README.md
```

---

## Documentation

| Document | Description |
|---|---|
| [QA Test Strategy](docs/qa-test-strategy.md) | Testing approach, tools rationale, risk-based coverage |
| [QA Test Plan](docs/qa-test-plan.md) | Scope, objectives, environment, entry/exit criteria |
| [Test Scenarios](docs/test-scenarios.md) | All scenarios by feature area |
| [Traceability Matrix](docs/traceability-matrix.md) | Requirements → risk → test → tool → status |
| [Risk Analysis](docs/risk-analysis.md) | Business and technical risks with ratings |
| [Bug Report Examples](docs/bug-report-examples.md) | Professional defect reports |
| [API Test Summary](docs/api-test-summary.md) | Postman coverage and results |
| [Accessibility Test Summary](docs/accessibility-test-summary.md) | Axe findings and WCAG notes |
| [Performance Test Summary](docs/performance-test-summary.md) | k6 results and thresholds |
| [QA Executive Summary](docs/qa-executive-summary.md) | Release readiness and recommendations |
