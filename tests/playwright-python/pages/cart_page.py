BASE_URL = "http://localhost:5173"


class CartPage:
    def __init__(self, page):
        self.page = page
        self.cart_items = page.get_by_test_id("cart-item")
        self.total_amount = page.get_by_test_id("cart-total-amount")
        self.checkout_button = page.get_by_test_id("cart-checkout-button")
        self.empty_message = page.get_by_test_id("empty-cart-message")

    def navigate(self):
        self.page.goto(f"{BASE_URL}/cart")

    def wait_for_cart(self):
        # Wait for either cart items or empty message to appear
        self.page.wait_for_selector(
            '[data-testid="cart-item"], [data-testid="empty-cart-message"]'
        )

    def get_item_count(self):
        self.wait_for_cart()
        return self.cart_items.count()

    def get_total_text(self):
        self.wait_for_cart()
        return self.total_amount.inner_text()

    def remove_first_item(self):
        self.wait_for_cart()
        self.page.get_by_test_id("cart-item-remove-button").first.click()

    def proceed_to_checkout(self):
        self.wait_for_cart()
        self.checkout_button.click()

    def is_empty(self):
        self.wait_for_cart()
        return self.empty_message.is_visible()
