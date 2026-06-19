import { test, expect } from "../../fixtures/index.js";
import { loadTestData } from "../../utils/testDataLoader.js";
import { resolveScenarioCredentials } from "../../utils/credentialResolver.js";

const data = loadTestData("auth/login.json");

test.describe("Login", () => {
  test.beforeEach(async ({ page, loginPage, clearSession }) => {
    await clearSession();
    await loginPage.openLogin();
    await page.evaluate(() => localStorage.clear());
    await loginPage.openLogin();
  });

  for (const scenario of data.scenarios) {
    test(`[${scenario.id}] ${scenario.name}`, async ({ page, loginPage, dashboardPage, toast }) => {
      const { email, password } = resolveScenarioCredentials(scenario);
      await loginPage.fillCredentials(email, password);
      await loginPage.submit();

      const { expected } = scenario;

      if (expected.type === "success") {
        await expect(page).toHaveURL(expected.url ?? data.urls.dashboard);
        await dashboardPage.waitForLoaded();
        const toastDef = data.toasts[expected.toast];
        expect(await toast.hasTitle(toastDef.variant, toastDef.title)).toBe(true);
        return;
      }

      if (expected.type === "auth-error") {
        await expect(page).toHaveURL(new RegExp(data.urls.loginPattern));
        const toastDef = data.toasts[expected.toast];
        expect(await toast.hasTitle(toastDef.variant, toastDef.title)).toBe(true);
        return;
      }

      if (expected.type === "validation-error") {
        const message = data.validationErrors[expected.errorKey];
        expect(await loginPage.hasValidationError(message)).toBe(true);
      }
    });
  }

  for (const check of data.uiChecks) {
    test(`[${check.id}] ${check.name}`, async ({ page, loginPage }) => {
      const { expected } = check;

      if (expected.type === "prefill") {
        const { email, password } = resolveScenarioCredentials(expected);
        expect(await loginPage.emailValue()).toBe(email);
        expect(await loginPage.passwordValue()).toBe(password);
        return;
      }

      const { email, password } = resolveScenarioCredentials(check);
      await loginPage.fillCredentials(email, password);
      await loginPage.submit();
      await expect(page).toHaveURL(expected.url ?? data.urls.dashboard);
    });
  }
});
