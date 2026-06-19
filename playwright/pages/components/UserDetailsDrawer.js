import { BasePage } from "../BasePage.js";

export class UserDetailsDrawer extends BasePage {
  async close() {
    await this.testId("details-close").click();
  }

  async isLoaded() {
    return (await this.isVisible("details-name")) && (await this.isVisible("details-email"));
  }
}
