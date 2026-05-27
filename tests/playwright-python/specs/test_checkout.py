import pytest
from pages.login_page import LoginPage
from pages.products_page import ProductsPage
from pages.cart_page import CartPage
from pages.checkout_page import CheckoutPage
from pages.order_confirmation_page import OrderConfirmationPage


@pytest.fixture(autouse=True)
def login_and_add_item(page, users):
    login = LoginPage(page)
    login.navigate()
    login.login(users["standard"]["username"], users["standard"]["password"])
    page.wait_for_url("**/products")
    products = ProductsPage(page)
    products.add_first_product_to_cart()
    page.wait_for_timeout(500)


class TestCheckout:
    def test_valid_checkout_shows_confirmation(self, page, checkout_data):
        cart = CartPage(page)
        cart.navigate()
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")
        checkout = CheckoutPage(page)
        checkout.fill_form(checkout_data["valid"])
        checkout.submit()
        page.wait_for_url("**/confirmation")
        confirmation = OrderConfirmationPage(page)
        assert confirmation.is_visible()

    def test_confirmation_shows_order_id(self, page, checkout_data):
        cart = CartPage(page)
        cart.navigate()
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")
        checkout = CheckoutPage(page)
        checkout.fill_form(checkout_data["valid"])
        checkout.submit()
        page.wait_for_url("**/confirmation")
        confirmation = OrderConfirmationPage(page)
        order_id = confirmation.get_order_id_text()
        assert "ORD" in order_id

    def test_missing_email_shows_validation_error(self, page, checkout_data):
        cart = CartPage(page)
        cart.navigate()
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")
        checkout = CheckoutPage(page)
        checkout.fill_form(checkout_data["missing_email"])
        checkout.submit()
        # Should stay on checkout page — not navigate to confirmation
        assert "/checkout" in page.url

    def test_empty_form_does_not_submit(self, page):
        cart = CartPage(page)
        cart.navigate()
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")
        checkout = CheckoutPage(page)
        checkout.submit()
        assert "/checkout" in page.url
