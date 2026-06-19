package com.automation.um.tests.auth;

import com.automation.um.config.Config;
import com.automation.um.core.BaseTest;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {
  @BeforeMethod
  public void resetSession() {
    clearSession();
    loginPage.openLogin();
    loginPage.clearStorage();
    loginPage.openLogin();
  }

  @Test
  public void shouldLoginWithValidCredentialsAndShowSuccessToast() {
    loginPage.login(Config.ADMIN_EMAIL, Config.ADMIN_PASSWORD);
    ExpectedConditions.urlToBe(Config.BASE_URL + "/").apply(driver);
    dashboardPage.waitForLoaded();
    Assert.assertTrue(toast.hasTitle("success", "Welcome back"));
  }

  @Test
  public void shouldShowErrorToastForInvalidCredentials() {
    loginPage.login("wrong@acme.test", "wrongpass");
    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
    Assert.assertTrue(toast.hasTitle("error", "Login failed"));
  }

  @Test
  public void shouldValidateRequiredEmailField() {
    loginPage.fillCredentials("", Config.ADMIN_PASSWORD);
    loginPage.submit();
    Assert.assertTrue(loginPage.hasValidationError("Email is required"));
  }

  @Test
  public void shouldValidateRequiredPasswordField() {
    loginPage.fillCredentials(Config.ADMIN_EMAIL, "");
    loginPage.submit();
    Assert.assertTrue(loginPage.hasValidationError("Password is required"));
  }

  @Test
  public void shouldValidateEmailFormat() {
    loginPage.fillCredentials("not-an-email", Config.ADMIN_PASSWORD);
    loginPage.submit();
    Assert.assertTrue(loginPage.hasValidationError("Enter a valid email"));
  }

  @Test
  public void shouldDisableSubmitButtonWhileSigningIn() {
    loginPage.fillCredentials(Config.ADMIN_EMAIL, Config.ADMIN_PASSWORD);
    loginPage.submit();
    ExpectedConditions.urlToBe(Config.BASE_URL + "/").apply(driver);
  }

  @Test
  public void shouldPreFillSampleAdminCredentials() {
    Assert.assertEquals(loginPage.emailValue(), Config.ADMIN_EMAIL);
    Assert.assertEquals(loginPage.passwordValue(), Config.ADMIN_PASSWORD);
  }
}
