package com.automation.um.tests.auth;

import com.automation.um.core.BaseTest;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class RouteGuardTest extends BaseTest {
  @BeforeMethod
  public void resetSession() {
    clearSession();
  }

  @Test
  public void shouldRedirectUnauthenticatedUsersFromDashboardToLogin() {
    driver.get(com.automation.um.config.Config.BASE_URL + "/");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
  }

  @Test
  public void shouldRedirectUnauthenticatedUsersFromUsersPageToLogin() {
    driver.get(com.automation.um.config.Config.BASE_URL + "/users");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
  }

  @Test
  public void shouldRedirectUnauthenticatedUsersFromProductsPageToLogin() {
    driver.get(com.automation.um.config.Config.BASE_URL + "/products");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
  }

  @Test
  public void shouldRedirectToIntendedPageAfterLogin() {
    driver.get(com.automation.um.config.Config.BASE_URL + "/users");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
    loginPage.loginWithDefaults();
    usersPage.waitForTableReady();
    Assert.assertTrue(driver.getCurrentUrl().contains("/users"));
  }
}
