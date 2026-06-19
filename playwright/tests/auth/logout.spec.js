import { test, expect } from "../../fixtures/index.js";

test.describe("Logout", () => {
  test("should logout and redirect to login with success toast", async ({
    page,
    loginAsAdmin,
    appLayout,
    toast
  }) => {
    await loginAsAdmin();
    await appLayout.logout();
    await expect(page).toHaveURL(/\/login/);
    expect(await toast.hasTitle("success", "Logged out")).toBe(true);
  });

  test("should block access to protected routes after logout", async ({
    page,
    loginAsAdmin,
    appLayout
  }) => {
    await loginAsAdmin();
    await appLayout.logout();
    await page.goto("/users");
    await expect(page).toHaveURL(/\/login/);
  });
});
