package com.automation.um.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public final class TestDataFactory {
  private TestDataFactory() {}

  public static String uniqueEmail(String prefix) {
    return prefix + "." + System.currentTimeMillis() + "." + UUID.randomUUID().toString().substring(0, 6) + "@acme.test";
  }

  public static Map<String, String> buildUser() {
    return buildUser(new HashMap<>());
  }

  public static Map<String, String> buildUser(Map<String, String> overrides) {
    String stamp = String.valueOf(System.currentTimeMillis()).substring(7);
    Map<String, String> user = new HashMap<>();
    user.put("firstName", "E2E");
    user.put("lastName", "User" + stamp);
    user.put("email", uniqueEmail("user"));
    user.put("phone", "555-" + stamp.substring(0, 3) + "-" + stamp.substring(3));
    user.put("role", "Engineer");
    user.put("status", "Active");
    user.putAll(overrides);
    return user;
  }
}
