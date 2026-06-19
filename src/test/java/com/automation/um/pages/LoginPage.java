package com.automation.um.pages;

import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {
  public LoginPage(WebDriver driver) {
    super(driver);
  }

  public void openLogin() {
    open("/login");
    el("login-form");
  }

  public void fillCredentials(String email, String password) {
    fillInput("login-email", email);
    fillInput("login-password", password);
  }

  public void submit() {
    el("login-submit").click();
  }

  public void login(String email, String password) {
    fillCredentials(email, password);
    submit();
  }

  public void loginWithDefaults() {
    login("admin@acme.test", "admin123");
  }

  public boolean hasValidationError(String text) {
    return driver.getPageSource().contains(text);
  }

  public String emailValue() {
    return el("login-email").getAttribute("value");
  }

  public String passwordValue() {
    return el("login-password").getAttribute("value");
  }

  public boolean isSubmitDisabled() {
    return !el("login-submit").isEnabled();
  }
}
