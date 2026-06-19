import { BasePage } from "../BasePage.js";

export class ConfirmDialog extends BasePage {
  async confirm() {
    await this.testId("confirm-ok").click();
  }

  async cancel() {
    await this.testId("confirm-cancel").click();
  }

  async isOpen() {
    return this.isVisible("confirm-ok");
  }
}
