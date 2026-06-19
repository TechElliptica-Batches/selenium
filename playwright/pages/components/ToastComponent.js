import { BasePage } from "../BasePage.js";

export class ToastComponent extends BasePage {
  async toastVisible(variant) {
    return this.isVisible(`toast-${variant}`);
  }

  async hasTitle(variant, title) {
    if (!(await this.toastVisible(variant))) return false;
    const text = await this.testId(`toast-${variant}`).textContent();
    return text?.includes(title) ?? false;
  }
}
