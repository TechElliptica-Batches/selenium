package com.automation.um.pages.components;

import com.automation.um.pages.BasePage;
import java.util.Map;
import org.openqa.selenium.WebDriver;

public class UserFormModal extends BasePage {
  public UserFormModal(WebDriver driver) {
    super(driver);
  }

  public void fill(Map<String, String> user) {
    if (user.containsKey("firstName")) fillInput("user-firstName", user.get("firstName"));
    if (user.containsKey("lastName")) fillInput("user-lastName", user.get("lastName"));
    if (user.containsKey("email")) fillInput("user-email", user.get("email"));
    if (user.containsKey("phone")) fillInput("user-phone", user.get("phone"));
    if (user.containsKey("role")) selectOptionByValue("user-role", user.get("role"));
    if (user.containsKey("status")) selectOptionByValue("user-status", user.get("status"));
  }

  public void submit() {
    el("user-form-submit").click();
  }

  public void cancel() {
    el("user-form-cancel").click();
  }

  public boolean hasValidationError(String text) {
    return driver.getPageSource().contains(text);
  }

  public boolean hasServerError(String text) {
    return driver.getPageSource().contains(text);
  }

  public boolean isOpen() {
    return isVisible("user-form-submit");
  }
}
