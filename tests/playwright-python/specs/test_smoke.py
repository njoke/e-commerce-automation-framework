"""
Smoke test: Full end-to-end flow
Login → Products → Add to Cart → Checkout → Confirmation
"""
import pytest
from pages.login_page import LoginPage
from pages.products_page import ProductsPage
from pages.cart_page import CartPage
from pages.checkout_page import CheckoutPage
from pages.order_confirmation_page import OrderConfirmationPage


class TestSmoke:
    def test_full_purchase_flow(self, page, users, checkout_data):
        # Step 1: Login
        login = LoginPage(page)
        login.navigate()
        login.login(users["standard"]["username"], users["standard"]["password"])
        page.wait_for_url("**/products")
        assert "/products" in page.url

        # Step 2: Products load
        products = ProductsPage(page)
        assert products.get_product_count() > 0

        # Step 3: Add first in-stock product to cart
        products.add_first_product_to_cart()
        page.wait_for_timeout(500)
        badge = page.get_by_test_id("cart-icon-badge")
        assert int(badge.inner_text()) >= 1

        # Step 4: Go to cart
        cart = CartPage(page)
        cart.navigate()
        assert cart.get_item_count() >= 1
        assert "$" in cart.get_total_text()

        # Step 5: Proceed to checkout
        cart.proceed_to_checkout()
        page.wait_for_url("**/checkout")

        # Step 6: Fill checkout form and submit
        checkout = CheckoutPage(page)
        checkout.fill_form(checkout_data["valid"])
        checkout.submit()

        # Step 7: Confirm order
        page.wait_for_url("**/confirmation")
        confirmation = OrderConfirmationPage(page)
        assert confirmation.is_visible()
        assert "ORD" in confirmation.get_order_id_text()
