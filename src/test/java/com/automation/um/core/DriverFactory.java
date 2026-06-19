package com.automation.um.core;

import com.automation.um.config.Config;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public final class DriverFactory {
  private DriverFactory() {}

  public static WebDriver createDriver() {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--window-size=1440,900");
    options.addArguments("--disable-search-engine-choice-screen");
    if (Config.HEADLESS) {
      options.addArguments("--headless=new");
    }
    return new ChromeDriver(options);
  }
}
