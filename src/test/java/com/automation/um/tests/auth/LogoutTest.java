package com.automation.um.tests.auth;

import com.automation.um.core.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LogoutTest extends BaseTest {
  @Test
  public void shouldLogoutAndRedirectToLoginWithSuccessToast() {
    loginAsAdmin();
    appLayout.logout();
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
    Assert.assertTrue(toast.hasTitle("success", "Logged out"));
  }

  @Test
  public void shouldBlockAccessToProtectedRoutesAfterLogout() {
    loginAsAdmin();
    appLayout.logout();
    driver.get(com.automation.um.config.Config.BASE_URL + "/users");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
  }
}
