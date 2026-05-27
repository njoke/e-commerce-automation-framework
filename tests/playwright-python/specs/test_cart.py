import pytest
from pages.login_page import LoginPage
from pages.products_page import ProductsPage
from pages.cart_page import CartPage


@pytest.fixture(autouse=True)
def login_first(page, users):
    login = LoginPage(page)
    login.navigate()
    login.login(users["standard"]["username"], users["standard"]["password"])
    page.wait_for_url("**/products")


class TestCart:
    def test_add_item_updates_cart_badge(self, page):
        products = ProductsPage(page)
        badge = page.get_by_test_id("cart-icon-badge")
        badge_text = badge.inner_text().strip() if badge.is_visible() else ""
        initial_count = int(badge_text) if badge_text.isdigit() else 0
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        new_badge_text = badge.inner_text().strip()
        new_count = int(new_badge_text) if new_badge_text.isdigit() else 0
        assert new_count == initial_count + 1

    def test_cart_page_shows_added_item(self, page):
        products = ProductsPage(page)
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        cart = CartPage(page)
        cart.navigate()
        assert cart.get_item_count() >= 1

    def test_cart_shows_total(self, page):
        products = ProductsPage(page)
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        cart = CartPage(page)
        cart.navigate()
        total = cart.get_total_text()
        assert "$" in total

    def test_remove_item_from_cart(self, page):
        products = ProductsPage(page)
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        cart = CartPage(page)
        cart.navigate()
        initial_count = cart.get_item_count()
        cart.remove_first_item()
        page.wait_for_timeout(500)
        new_count = cart.get_item_count()
        assert new_count == initial_count - 1

    def test_empty_cart_shows_message(self, page):
        cart = CartPage(page)
        cart.navigate()
        if cart.get_item_count() > 0:
            cart.remove_first_item()
            page.wait_for_timeout(500)
        assert cart.is_empty()
