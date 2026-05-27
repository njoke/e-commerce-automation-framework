"""
Axe accessibility tests for Amplifii Electronics.

Run from tests/playwright-python/:
    uv run python ../accessibility/axe_accessibility_tests.py

Or as pytest (for CI):
    uv run pytest ../accessibility/axe_accessibility_tests.py -v
"""

import json
import os
import sys
from playwright.sync_api import sync_playwright
from axe_playwright_python.sync_playwright import Axe

BASE_URL = "http://localhost:5173"
API_URL = "http://localhost:3001"

# Auth stored in localStorage after login
AUTH_KEY = "amplifii_auth"

# Pages that require authentication
AUTHENTICATED_PAGES = [
    (f"{BASE_URL}/products", "Product Catalog"),
    (f"{BASE_URL}/cart", "Cart Page"),
    (f"{BASE_URL}/checkout", "Checkout Page"),
    (f"{BASE_URL}/orders", "Order History"),
]

# Pages that do not require authentication
PUBLIC_PAGES = [
    (f"{BASE_URL}/login", "Login Page"),
]


def get_auth_payload():
    """Log in via API and return localStorage auth payload."""
    import urllib.request
    import urllib.error

    data = json.dumps({"username": "standard_user", "password": "secret_sauce"}).encode()
    req = urllib.request.Request(
        f"{API_URL}/api/login",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        body = json.loads(resp.read())
    return json.dumps({
        "user": {
            "id": body["userId"],
            "username": body["username"],
            "role": "standard",
        },
        "token": body["token"],
    })


def run_axe_on_page(page, url, page_name):
    """Navigate to url, run Axe, return violations list."""
    page.goto(url)
    page.wait_for_load_state("networkidle")
    axe = Axe()
    results = axe.run(page)
    violations = results.response.get("violations", [])
    return violations


def print_violations(page_name, violations):
    print(f"\n{'='*60}")
    print(f"  {page_name}")
    print(f"{'='*60}")
    print(f"  Violations found: {len(violations)}")
    for v in violations:
        impact = v.get("impact", "unknown").upper()
        vid = v.get("id", "")
        desc = v.get("description", "")
        nodes = len(v.get("nodes", []))
        print(f"\n  [{impact}] {vid} ({nodes} element(s) affected)")
        print(f"  {desc}")
    if not violations:
        print("  No violations detected.")


def write_report(all_results, report_path):
    """Write JSON report to file."""
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\nReport saved: {report_path}")


def main():
    report_path = os.path.join(
        os.path.dirname(__file__),
        "../../reports/accessibility/axe-report.json"
    )

    all_results = {}
    total_violations = 0

    print("Amplifii Electronics — Axe Accessibility Scan")
    print(f"Target: {BASE_URL}")

    try:
        auth_payload = get_auth_payload()
    except Exception as e:
        print(f"\nERROR: Could not log in to get auth token: {e}")
        print("Make sure the backend is running at http://localhost:3001")
        sys.exit(1)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Seed localStorage with auth so protected pages don't redirect
        page.goto(BASE_URL)
        page.evaluate(
            f"window.localStorage.setItem('{AUTH_KEY}', JSON.stringify({auth_payload}))"
        )

        # Scan public pages
        for url, name in PUBLIC_PAGES:
            violations = run_axe_on_page(page, url, name)
            print_violations(name, violations)
            all_results[name] = {
                "url": url,
                "violation_count": len(violations),
                "violations": violations,
            }
            total_violations += len(violations)

        # Seed auth again (page navigations may clear state in some cases)
        page.goto(BASE_URL)
        page.evaluate(
            f"window.localStorage.setItem('{AUTH_KEY}', JSON.stringify({auth_payload}))"
        )

        # Scan authenticated pages
        for url, name in AUTHENTICATED_PAGES:
            violations = run_axe_on_page(page, url, name)
            print_violations(name, violations)
            all_results[name] = {
                "url": url,
                "violation_count": len(violations),
                "violations": violations,
            }
            total_violations += len(violations)

        browser.close()

    print(f"\n{'='*60}")
    print(f"  TOTAL VIOLATIONS: {total_violations}")
    print(f"{'='*60}")

    write_report(all_results, report_path)

    # Exit non-zero if critical violations found
    critical = sum(
        1 for page_data in all_results.values()
        for v in page_data["violations"]
        if v.get("impact") == "critical"
    )
    if critical > 0:
        print(f"\nFAIL: {critical} critical violation(s) found.")
        sys.exit(1)
    else:
        print("\nPASS: No critical violations detected.")


# ── pytest integration ──────────────────────────────────────────────────────

import pytest


@pytest.fixture(scope="module")
def auth_browser_page():
    """Shared browser page with auth seeded in localStorage."""
    try:
        auth_payload = get_auth_payload()
    except Exception as e:
        pytest.skip(f"Backend unreachable: {e}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto(BASE_URL)
        page.evaluate(
            f"window.localStorage.setItem('{AUTH_KEY}', JSON.stringify({auth_payload}))"
        )
        yield page
        browser.close()


@pytest.mark.parametrize("url,name", PUBLIC_PAGES + AUTHENTICATED_PAGES)
def test_no_critical_axe_violations(auth_browser_page, url, name):
    """Fails if any critical Axe violation found on the page."""
    page = auth_browser_page
    page.goto(url)
    page.wait_for_load_state("networkidle")
    axe = Axe()
    results = axe.run(page)
    violations = results.response.get("violations", [])
    critical = [v for v in violations if v.get("impact") == "critical"]
    assert critical == [], (
        f"{name}: {len(critical)} critical violation(s)\n"
        + "\n".join(f"  [{v['id']}] {v['description']}" for v in critical)
    )


if __name__ == "__main__":
    main()
