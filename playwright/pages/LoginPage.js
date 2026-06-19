import { BasePage } from "./BasePage.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";

export class LoginPage extends BasePage {
  async openLogin() {
    await this.open("/login");
    await this.el("login-form");
  }

  async fillCredentials(email, password) {
    await this.fillInput("login-email", email);
    await this.fillInput("login-password", password);
  }

  async submit() {
    await this.testId("login-submit").click();
  }

  async login(email, password) {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  async loginWithDefaults() {
    await this.login(ADMIN_EMAIL, ADMIN_PASSWORD);
  }

  async hasValidationError(text) {
    return this.page.getByText(text).isVisible();
  }

  async emailValue() {
    return this.testId("login-email").inputValue();
  }

  async passwordValue() {
    return this.testId("login-password").inputValue();
  }

  async isSubmitDisabled() {
    return this.testId("login-submit").isDisabled();
  }
}
