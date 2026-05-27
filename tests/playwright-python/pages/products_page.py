BASE_URL = "http://localhost:5173"


class ProductsPage:
    def __init__(self, page):
        self.page = page
        self.search_input = page.get_by_test_id("product-search-input")
        self.product_cards = page.get_by_test_id("product-card")
        self.sort_select = page.get_by_test_id("product-sort-select")
        self.category_filter = page.get_by_test_id("product-category-filter")

    def navigate(self):
        self.page.goto(f"{BASE_URL}/products")

    def search(self, term):
        self.search_input.fill(term)
        self.search_input.press("Enter")

    def wait_for_products_or_empty(self):
        self.page.wait_for_selector(
            '[data-testid="product-card"], [data-testid="empty-products-message"]'
        )

    def wait_for_products(self):
        self.page.get_by_test_id("product-card").first.wait_for()

    def get_product_count(self):
        self.wait_for_products_or_empty()
        return self.product_cards.count()

    def get_first_product_name(self):
        self.wait_for_products()
        return self.page.get_by_test_id("product-card-name").first.inner_text()

    def get_first_product_price(self):
        self.wait_for_products()
        return self.page.get_by_test_id("product-card-price").first.inner_text()

    def add_first_product_to_cart(self):
        self.wait_for_products()
        self.page.get_by_test_id("product-add-to-cart-button").first.click()

    def sort_by(self, value):
        # MUI Select — click the visible combobox, then click the menu item
        self.page.locator('[aria-labelledby="sort-label"]').click()
        self.page.locator(f'li[data-value="{value}"]').click()
        self.wait_for_products_or_empty()

    def filter_by_category(self, category):
        # MUI Select — click the visible combobox, then click the menu item
        self.page.locator('[aria-labelledby="category-label"]').click()
        self.page.locator(f'li[data-value="{category}"]').click()
        self.wait_for_products_or_empty()
