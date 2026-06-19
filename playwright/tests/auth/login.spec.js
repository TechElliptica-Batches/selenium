import { test, expect } from "../../fixtures/index.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config/config.js";

test.describe("Login", () => {
  test.beforeEach(async ({ page, loginPage, clearSession }) => {
    await clearSession();
    await loginPage.openLogin();
    await page.evaluate(() => localStorage.clear());
    await loginPage.openLogin();
  });

  test("should login with valid credentials and show success toast", async ({
    page,
    loginPage,
    dashboardPage,
    toast
  }) => {
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await expect(page).toHaveURL("/");
    await dashboardPage.waitForLoaded();
    expect(await toast.hasTitle("success", "Welcome back")).toBe(true);
  });

  test("should show error toast for invalid credentials", async ({ page, loginPage, toast }) => {
    await loginPage.login("wrong@acme.test", "wrongpass");
    await expect(page).toHaveURL(/\/login/);
    expect(await toast.hasTitle("error", "Login failed")).toBe(true);
  });

  test("should validate required email field", async ({ loginPage }) => {
    await loginPage.fillCredentials("", ADMIN_PASSWORD);
    await loginPage.submit();
    expect(await loginPage.hasValidationError("Email is required")).toBe(true);
  });

  test("should validate required password field", async ({ loginPage }) => {
    await loginPage.fillCredentials(ADMIN_EMAIL, "");
    await loginPage.submit();
    expect(await loginPage.hasValidationError("Password is required")).toBe(true);
  });

  test("should validate email format", async ({ loginPage }) => {
    await loginPage.fillCredentials("not-an-email", ADMIN_PASSWORD);
    await loginPage.submit();
    expect(await loginPage.hasValidationError("Enter a valid email")).toBe(true);
  });

  test("should disable submit button while signing in", async ({ page, loginPage }) => {
    await loginPage.fillCredentials(ADMIN_EMAIL, ADMIN_PASSWORD);
    await loginPage.submit();
    await expect(page).toHaveURL("/");
  });

  test("should pre-fill sample admin credentials", async ({ loginPage }) => {
    expect(await loginPage.emailValue()).toBe(ADMIN_EMAIL);
    expect(await loginPage.passwordValue()).toBe(ADMIN_PASSWORD);
  });
});
