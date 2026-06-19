package com.automation.um.pages.components;

import com.automation.um.pages.BasePage;
import org.openqa.selenium.WebDriver;

public class ConfirmDialog extends BasePage {
  public ConfirmDialog(WebDriver driver) {
    super(driver);
  }

  public void confirm() {
    el("confirm-ok").click();
  }

  public void cancel() {
    el("confirm-cancel").click();
  }

  public boolean isOpen() {
    return isVisible("confirm-ok");
  }
}
