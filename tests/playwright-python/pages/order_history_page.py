BASE_URL = "http://localhost:5173"


class OrderHistoryPage:
    def __init__(self, page):
        self.page = page
        self.order_list = page.get_by_test_id("order-history-list")
        self.empty_message = page.get_by_test_id("empty-orders-message")

    def navigate(self):
        self.page.goto(f"{BASE_URL}/orders")

    def has_orders(self):
        return self.order_list.is_visible()

    def is_empty(self):
        return self.empty_message.is_visible()
