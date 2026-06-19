package com.automation.um.utils;

import com.automation.um.config.Config;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class WaitUtils {
  private WaitUtils() {}

  public static WebDriverWait wait(WebDriver driver) {
    return new WebDriverWait(driver, Duration.ofSeconds(Config.EXPLICIT_WAIT_SECONDS));
  }

  public static WebDriverWait longWait(WebDriver driver) {
    return new WebDriverWait(driver, Duration.ofSeconds(30));
  }

  public static WebElement visible(WebDriver driver, By locator) {
    return wait(driver).until(ExpectedConditions.visibilityOfElementLocated(locator));
  }

  public static void invisible(WebDriver driver, By locator) {
    wait(driver).until(ExpectedConditions.invisibilityOfElementLocated(locator));
  }

  public static void debounce() {
    try {
      Thread.sleep(500);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RuntimeException(e);
    }
  }
}
