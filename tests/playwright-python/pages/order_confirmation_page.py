class OrderConfirmationPage:
    def __init__(self, page):
        self.page = page
        self.heading = page.get_by_test_id("order-confirmation-heading")
        self.order_id = page.get_by_test_id("order-confirmation-order-id")

    def get_heading_text(self):
        return self.heading.inner_text()

    def get_order_id_text(self):
        return self.order_id.inner_text()

    def is_visible(self):
        return self.heading.is_visible()
