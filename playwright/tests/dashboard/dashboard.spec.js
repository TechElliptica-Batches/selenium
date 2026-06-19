import { test, expect } from "../../fixtures/index.js";
import { getUsersViaApi } from "../../utils/apiClient.js";

test.describe("Dashboard", () => {
  test("should display dashboard heading and total users stat", async ({
    loginAsAdmin,
    dashboardPage,
    apiAuth
  }) => {
    await loginAsAdmin();
    await dashboardPage.waitForLoaded();
    const uiTotal = await dashboardPage.getTotalUsersCount();
    const apiData = await getUsersViaApi(apiAuth.token, "page=1&pageSize=1");
    expect(uiTotal).toBe(apiData.total);
  });

  test("should show dashboard as default landing page after login", async ({
    page,
    loginAsAdmin,
    dashboardPage
  }) => {
    await loginAsAdmin();
    expect(page.url().endsWith("/") || page.url().endsWith(":5173/")).toBe(true);
    await dashboardPage.waitForLoaded();
  });
});
