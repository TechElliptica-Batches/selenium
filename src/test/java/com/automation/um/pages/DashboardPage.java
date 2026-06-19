package com.automation.um.pages;

import com.automation.um.config.Config;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {
  public DashboardPage(WebDriver driver) {
    super(driver);
  }

  public void waitForLoaded() {
    el("stat-total-users");
    wait.until(d -> {
      String text = d.findElement(testId("stat-total-users")).getText().trim();
      return text.matches("\\d+");
    });
  }

  public int getTotalUsersCount() {
    return Integer.parseInt(el("stat-total-users").getText().trim());
  }

  public boolean isOnDashboard() {
    return driver.getCurrentUrl().replaceAll("/$", "").endsWith(Config.BASE_URL.replaceAll("/$", ""))
        || driver.getCurrentUrl().endsWith("/")
        && isVisible("stat-total-users");
  }
}
