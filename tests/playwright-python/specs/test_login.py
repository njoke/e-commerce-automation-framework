import pytest
from pages.login_page import LoginPage


class TestLogin:
    def test_valid_login_redirects_to_products(self, page, users):
        login = LoginPage(page)
        login.navigate()
        login.login(users["standard"]["username"], users["standard"]["password"])
        page.wait_for_url("**/products")
        assert "/products" in page.url

    def test_invalid_credentials_shows_error(self, page, users):
        login = LoginPage(page)
        login.navigate()
        login.login(users["invalid"]["username"], users["invalid"]["password"])
        login.error_message.wait_for()
        assert login.error_message.is_visible()

    def test_locked_user_shows_error(self, page, users):
        login = LoginPage(page)
        login.navigate()
        login.login(users["locked"]["username"], users["locked"]["password"])
        login.error_message.wait_for()
        assert login.error_message.is_visible()
        assert "locked" in login.get_error_text().lower()

    def test_empty_fields_shows_error(self, page):
        login = LoginPage(page)
        login.navigate()
        login.login("", "")
        login.error_message.wait_for()
        assert login.error_message.is_visible()

    def test_logout_redirects_to_login(self, page, users):
        login = LoginPage(page)
        login.navigate()
        login.login(users["standard"]["username"], users["standard"]["password"])
        page.wait_for_url("**/products")
        page.get_by_test_id("header-logout-button").click()
        page.wait_for_url("**/login")
        assert "/login" in page.url
