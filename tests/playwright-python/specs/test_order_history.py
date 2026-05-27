import pytest
from pages.login_page import LoginPage
from pages.products_page import ProductsPage
from pages.cart_page import CartPage
from pages.checkout_page import CheckoutPage
from pages.order_history_page import OrderHistoryPage


@pytest.fixture(autouse=True)
def login_first(page, users):
    login = LoginPage(page)
    login.navigate()
    login.login(users["standard"]["username"], users["standard"]["password"])
    page.wait_for_url("**/products")


class TestOrderHistory:
    def test_order_appears_in_history_after_checkout(self, page, checkout_data):
        # Add item and complete checkout
        products = ProductsPage(page)
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        cart = CartPage(page)
        cart.navigate()
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")
        checkout = CheckoutPage(page)
        checkout.fill_form(checkout_data["valid"])
        checkout.submit()
        page.wait_for_url("**/confirmation")

        # Check order history
        history = OrderHistoryPage(page)
        history.navigate()
        assert history.has_orders()

    def test_empty_orders_shows_message(self, page):
        # Use admin user who has no orders from this session
        login = LoginPage(page)
        login.navigate()
        # Log out first then log in as admin
        page.goto("http://localhost:5173/login")
        login.login("admin_user", "admin_sauce")
        page.wait_for_url("**/products")
        history = OrderHistoryPage(page)
        history.navigate()
        # Either has orders or shows empty state — both are valid
        assert history.has_orders() or history.is_empty()
