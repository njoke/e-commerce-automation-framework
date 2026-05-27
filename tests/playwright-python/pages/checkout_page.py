BASE_URL = "http://localhost:5173"


class CheckoutPage:
    def __init__(self, page):
        self.page = page
        self.first_name = page.get_by_test_id("checkout-first-name-input")
        self.last_name = page.get_by_test_id("checkout-last-name-input")
        self.email = page.get_by_test_id("checkout-email-input")
        self.address = page.get_by_test_id("checkout-address-input")
        self.city = page.get_by_test_id("checkout-city-input")
        self.state = page.get_by_test_id("checkout-state-input")
        self.zip_code = page.get_by_test_id("checkout-zip-input")
        self.card_number = page.get_by_test_id("checkout-card-number-input")
        self.submit_button = page.get_by_test_id("checkout-submit-button")

    def navigate(self):
        self.page.goto(f"{BASE_URL}/checkout")

    def fill_form(self, data):
        self.first_name.fill(data["firstName"])
        self.last_name.fill(data["lastName"])
        self.email.fill(data["email"])
        self.address.fill(data["address"])
        self.city.fill(data["city"])
        self.state.fill(data["state"])
        self.zip_code.fill(data["zip"])
        if data.get("cardNumber"):
            self.card_number.fill(data["cardNumber"])

    def submit(self):
        self.submit_button.click()
