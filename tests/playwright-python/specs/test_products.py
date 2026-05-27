import pytest
from pages.login_page import LoginPage
from pages.products_page import ProductsPage


@pytest.fixture(autouse=True)
def login_first(page, users):
    login = LoginPage(page)
    login.navigate()
    login.login(users["standard"]["username"], users["standard"]["password"])
    page.wait_for_url("**/products")


class TestProducts:
    def test_product_list_loads(self, page):
        products = ProductsPage(page)
        assert products.get_product_count() > 0

    def test_product_card_shows_name(self, page):
        products = ProductsPage(page)
        name = products.get_first_product_name()
        assert len(name) > 0

    def test_product_card_shows_price(self, page):
        products = ProductsPage(page)
        price = products.get_first_product_price()
        assert "$" in price

    def test_product_card_has_add_to_cart_button(self, page):
        button = page.get_by_test_id("product-add-to-cart-button").first
        button.wait_for()
        assert button.is_visible()

    def test_search_filters_products(self, page):
        products = ProductsPage(page)
        products.search("headphone")
        page.wait_for_timeout(500)
        count = products.get_product_count()
        assert count >= 1

    def test_search_no_results_returns_empty(self, page):
        products = ProductsPage(page)
        products.search("xyznotarealproduct999")
        page.wait_for_timeout(500)
        count = products.get_product_count()
        assert count == 0

    def test_sort_price_asc(self, page):
        products = ProductsPage(page)
        products.sort_by("price_asc")
        page.wait_for_timeout(500)
        prices = page.get_by_test_id("product-card-price").all_inner_texts()
        numeric = [float(p.replace("$", "").strip()) for p in prices]
        assert numeric == sorted(numeric)

    def test_sort_price_desc(self, page):
        products = ProductsPage(page)
        products.sort_by("price_desc")
        page.wait_for_timeout(500)
        prices = page.get_by_test_id("product-card-price").all_inner_texts()
        numeric = [float(p.replace("$", "").strip()) for p in prices]
        assert numeric == sorted(numeric, reverse=True)
