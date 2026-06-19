package com.automation.um.pages.components;

import com.automation.um.pages.BasePage;
import org.openqa.selenium.WebDriver;

public class UserDetailsDrawer extends BasePage {
  public UserDetailsDrawer(WebDriver driver) {
    super(driver);
  }

  public void close() {
    el("details-close").click();
  }

  public boolean isLoaded() {
    return isVisible("details-name") && isVisible("details-email");
  }
}
