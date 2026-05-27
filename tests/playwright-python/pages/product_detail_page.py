BASE_URL = "http://localhost:5173"


class ProductDetailPage:
    def __init__(self, page):
        self.page = page
        self.add_to_cart_button = page.get_by_test_id("product-add-to-cart-button")

    def navigate(self, product_id):
        self.page.goto(f"{BASE_URL}/products/{product_id}")
