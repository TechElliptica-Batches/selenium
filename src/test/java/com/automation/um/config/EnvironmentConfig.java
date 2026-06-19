package com.automation.um.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Loads environment configuration from classpath property files.
 *
 * <p>Resolution order (highest wins):
 * <ol>
 *   <li>OS environment variable (e.g. BASE_URL)</li>
 *   <li>JVM system property (e.g. -Dbase.url=...)</li>
 *   <li>{@code environments/local.override.properties} (optional, gitignored)</li>
 *   <li>{@code environments/{environment}.properties}</li>
 *   <li>{@code config.properties}</li>
 * </ol>
 *
 * <p>Select profile with {@code -Denvironment=staging} or {@code ENVIRONMENT=staging}.
 */
public final class EnvironmentConfig {
  private static final Properties PROPERTIES = load();

  private EnvironmentConfig() {}

  public static String environment() {
    return get("environment", "local");
  }

  public static String get(String key) {
    return get(key, null);
  }

  public static String get(String key, String defaultValue) {
    String fromEnv = System.getenv(toEnvKey(key));
    if (isPresent(fromEnv)) {
      return fromEnv.trim();
    }

    String fromSystem = System.getProperty(key);
    if (!isPresent(fromSystem)) {
      fromSystem = System.getProperty(toEnvKey(key));
    }
    if (isPresent(fromSystem)) {
      return fromSystem.trim();
    }

    String fromFile = PROPERTIES.getProperty(key);
    if (isPresent(fromFile)) {
      return fromFile.trim();
    }

    return defaultValue;
  }

  public static boolean getBoolean(String key, boolean defaultValue) {
    String value = get(key, String.valueOf(defaultValue));
    return Boolean.parseBoolean(value);
  }

  public static int getInt(String key, int defaultValue) {
    String value = get(key, String.valueOf(defaultValue));
    return Integer.parseInt(value);
  }

  private static Properties load() {
    Properties props = new Properties();
    String profile = resolveProfile();

    loadResource(props, "config.properties");
    loadResource(props, "environments/" + profile + ".properties");
    loadResource(props, "environments/" + profile + ".override.properties");
    loadResource(props, "environments/local.override.properties");

    props.setProperty("environment", profile);
    return props;
  }

  private static String resolveProfile() {
    String fromEnv = System.getenv("ENVIRONMENT");
    if (isPresent(fromEnv)) {
      return fromEnv.trim();
    }
    String fromProperty = System.getProperty("environment");
    if (isPresent(fromProperty)) {
      return fromProperty.trim();
    }
    return "local";
  }

  private static void loadResource(Properties target, String resourcePath) {
    try (InputStream stream = EnvironmentConfig.class.getClassLoader().getResourceAsStream(resourcePath)) {
      if (stream == null) {
        return;
      }
      Properties loaded = new Properties();
      loaded.load(stream);
      target.putAll(loaded);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to load config resource: " + resourcePath, e);
    }
  }

  private static String toEnvKey(String propertyKey) {
    return propertyKey.replace('.', '_').toUpperCase();
  }

  private static boolean isPresent(String value) {
    return value != null && !value.isBlank();
  }
}
