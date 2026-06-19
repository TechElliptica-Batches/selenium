package com.automation.um.utils;

import com.automation.um.config.Config;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public final class ApiClient {
  private static final ObjectMapper MAPPER = new ObjectMapper();
  private static final HttpClient HTTP = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();

  private ApiClient() {}

  public record AuthSession(String token, JsonNode user) {}

  public record UserRecord(String id, String email, String firstName, String lastName) {}

  public static AuthSession loginViaApi() throws Exception {
    Map<String, String> body = Map.of("email", Config.ADMIN_EMAIL, "password", Config.ADMIN_PASSWORD);
    JsonNode json = request(Config.USERS_API_BASE_URL, "POST", "/auth/login", body, null);
    JsonNode data = json.get("data");
    return new AuthSession(data.get("token").asText(), data.get("user"));
  }

  public static UserRecord createUserViaApi(Map<String, String> user, String token) throws Exception {
    JsonNode json = request(Config.USERS_API_BASE_URL, "POST", "/users", user, token);
    JsonNode data = json.get("data");
    return new UserRecord(
        data.get("id").asText(),
        data.get("email").asText(),
        data.get("firstName").asText(),
        data.get("lastName").asText()
    );
  }

  public static void deleteUserViaApi(String userId, String token) throws Exception {
    request(Config.USERS_API_BASE_URL, "DELETE", "/users/" + userId, null, token);
  }

  public static JsonNode getUsersViaApi(String token, String query) throws Exception {
    String path = query == null || query.isBlank() ? "/users" : "/users?" + query;
    return request(Config.USERS_API_BASE_URL, "GET", path, null, token).get("data");
  }

  public static JsonNode getProductsViaApi(String token, String query) throws Exception {
    String path = query == null || query.isBlank() ? "/products" : "/products?" + query;
    return request(Config.PRODUCTS_API_BASE_URL, "GET", path, null, token).get("data");
  }

  public static void clearSelectedProducts(String token) throws Exception {
    request(Config.USERS_API_BASE_URL, "PUT", "/me/selected-products", Map.of("productIds", java.util.List.of()), token);
  }

  private static JsonNode request(String baseUrl, String method, String path, Object body, String token) throws Exception {
    HttpRequest.Builder builder = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + path))
        .timeout(Duration.ofSeconds(20))
        .header("Content-Type", "application/json");

    if (token != null) {
      builder.header("Authorization", "Bearer " + token);
    }

    switch (method) {
      case "GET" -> builder.GET();
      case "DELETE" -> builder.DELETE();
      case "POST" -> builder.POST(HttpRequest.BodyPublishers.ofString(MAPPER.writeValueAsString(body)));
      case "PUT" -> builder.PUT(HttpRequest.BodyPublishers.ofString(MAPPER.writeValueAsString(body)));
      default -> throw new IllegalArgumentException("Unsupported method: " + method);
    }

    HttpResponse<String> response = HTTP.send(builder.build(), HttpResponse.BodyHandlers.ofString());
    JsonNode json = response.body() == null || response.body().isBlank()
        ? MAPPER.createObjectNode()
        : MAPPER.readTree(response.body());

    if (response.statusCode() >= 400) {
      String message = json.path("error").path("message").asText("HTTP " + response.statusCode());
      throw new RuntimeException("API " + method + " " + path + " failed: " + message);
    }
    return json;
  }
}
