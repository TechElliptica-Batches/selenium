import { BasePage } from "../BasePage.js";

export class UserFormModal extends BasePage {
  /**
   * @param {Record<string, string>} user
   */
  async fill(user) {
    if (user.firstName !== undefined) await this.fillInput("user-firstName", user.firstName);
    if (user.lastName !== undefined) await this.fillInput("user-lastName", user.lastName);
    if (user.email !== undefined) await this.fillInput("user-email", user.email);
    if (user.phone !== undefined) await this.fillInput("user-phone", user.phone);
    if (user.role !== undefined) await this.selectOptionByValue("user-role", user.role);
    if (user.status !== undefined) await this.selectOptionByValue("user-status", user.status);
  }

  async submit() {
    await this.testId("user-form-submit").click();
  }

  async cancel() {
    await this.testId("user-form-cancel").click();
  }

  async hasValidationError(text) {
    const content = await this.page.content();
    return content.includes(text);
  }

  async hasServerError(text) {
    const content = await this.page.content();
    return content.includes(text);
  }

  async isOpen() {
    return this.isVisible("user-form-submit");
  }
}
