BASE_URL = "http://localhost:5173"


class LoginPage:
    def __init__(self, page):
        self.page = page
        self.username_input = page.get_by_test_id("login-username-input")
        self.password_input = page.get_by_test_id("login-password-input")
        self.submit_button = page.get_by_test_id("login-submit-button")
        self.error_message = page.get_by_test_id("login-error-message")

    def navigate(self):
        self.page.goto(f"{BASE_URL}/login")

    def login(self, username, password):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.submit_button.click()

    def get_error_text(self):
        return self.error_message.inner_text()
