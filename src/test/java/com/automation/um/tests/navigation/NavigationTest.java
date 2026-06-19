package com.automation.um.tests.navigation;

import com.automation.um.core.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class NavigationTest extends BaseTest {
  @Test
  public void shouldNavigateBetweenDashboardUsersAndProducts() {
    loginAsAdmin();
    dashboardPage.waitForLoaded();

    appLayout.goToUsers();
    usersPage.waitForTableReady();
    Assert.assertTrue(driver.getCurrentUrl().contains("/users"));

    appLayout.goToProducts();
    productsPage.waitForGridReady();
    Assert.assertTrue(driver.getCurrentUrl().contains("/products"));

    appLayout.goToDashboard();
    dashboardPage.waitForLoaded();
  }

  @Test
  public void shouldHighlightActiveNavItem() {
    loginAsAdmin();
    appLayout.goToUsers();
    usersPage.waitForTableReady();
    Assert.assertTrue(appLayout.isNavUsersActive());
  }
}
