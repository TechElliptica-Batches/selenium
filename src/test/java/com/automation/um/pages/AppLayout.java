package com.automation.um.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class AppLayout extends BasePage {
  public AppLayout(WebDriver driver) {
    super(driver);
  }

  public void goToDashboard() {
    el("nav-dashboard").click();
    wait.until(ExpectedConditions.urlToBe(com.automation.um.config.Config.BASE_URL + "/"));
  }

  public void goToUsers() {
    el("nav-users").click();
    wait.until(ExpectedConditions.urlContains("/users"));
  }

  public void goToProducts() {
    el("nav-products").click();
    wait.until(ExpectedConditions.urlContains("/products"));
  }

  public void logout() {
    if (isVisible("logout")) {
      el("logout").click();
    } else {
      el("logout-mobile").click();
    }
    wait.until(ExpectedConditions.urlContains("/login"));
  }

  public boolean isNavUsersActive() {
    return el("nav-users").getAttribute("class").contains("bg-indigo-50");
  }
}
