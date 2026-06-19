import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PRODUCTS_API_BASE_URL,
  USERS_API_BASE_URL
} from "../config/config.js";

async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function request(baseUrl, method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body != null) options.body = JSON.stringify(body);

  const res = await fetch(`${baseUrl}${path}`, options);
  const json = await parseJson(res);

  if (!res.ok) {
    const message = json?.error?.message || `HTTP ${res.status}`;
    throw new Error(`API ${method} ${path} failed: ${message}`);
  }
  return json;
}

/**
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function loginViaApi(credentials = {}) {
  const email = credentials.email ?? ADMIN_EMAIL;
  const password = credentials.password ?? ADMIN_PASSWORD;
  const json = await request(USERS_API_BASE_URL, "POST", "/auth/login", { email, password });
  return { token: json.data.token, user: json.data.user };
}

/**
 * @returns {Promise<{ id: string, email: string, firstName: string, lastName: string }>}
 */
export async function createUserViaApi(user, token) {
  const json = await request(USERS_API_BASE_URL, "POST", "/users", user, token);
  const data = json.data;
  return {
    id: data.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName
  };
}

export async function deleteUserViaApi(userId, token) {
  await request(USERS_API_BASE_URL, "DELETE", `/users/${userId}`, null, token);
}

export async function getUsersViaApi(token, query = "") {
  const path = query ? `/users?${query}` : "/users";
  const json = await request(USERS_API_BASE_URL, "GET", path, null, token);
  return json.data;
}

export async function getProductsViaApi(token, query = "") {
  const path = query ? `/products?${query}` : "/products";
  const json = await request(PRODUCTS_API_BASE_URL, "GET", path, null, token);
  return json.data;
}

export async function clearSelectedProducts(token) {
  await request(USERS_API_BASE_URL, "PUT", "/me/selected-products", { productIds: [] }, token);
}
