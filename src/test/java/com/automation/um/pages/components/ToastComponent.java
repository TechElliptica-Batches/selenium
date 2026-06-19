package com.automation.um.pages.components;

import com.automation.um.pages.BasePage;
import org.openqa.selenium.WebDriver;

public class ToastComponent extends BasePage {
  public ToastComponent(WebDriver driver) {
    super(driver);
  }

  public boolean toastVisible(String variant) {
    return isVisible("toast-" + variant);
  }

  public boolean hasTitle(String variant, String title) {
    if (!toastVisible(variant)) {
      return false;
    }
    return el("toast-" + variant).getText().contains(title);
  }
}
