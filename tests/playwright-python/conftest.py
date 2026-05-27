import pytest
import json
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"


@pytest.fixture(scope="session")
def browser_context():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        yield context
        browser.close()


@pytest.fixture
def page(browser_context):
    page = browser_context.new_page()
    yield page
    page.close()


@pytest.fixture
def users():
    with open("fixtures/users.json") as f:
        return json.load(f)


@pytest.fixture
def checkout_data():
    with open("fixtures/checkout_data.json") as f:
        return json.load(f)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        page = item.funcargs.get("page")
        if page:
            import os
            os.makedirs("../../reports/screenshots", exist_ok=True)
            page.screenshot(path=f"../../reports/screenshots/{item.name}.png")
