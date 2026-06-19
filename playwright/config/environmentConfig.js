import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESOURCES_DIR = path.resolve(__dirname, "../resources");

/**
 * Loads environment configuration from property files.
 *
 * Resolution order (highest wins):
 * 1. OS environment variable (e.g. BASE_URL)
 * 2. process.argv / NODE_OPTIONS style: pass via process.env or CLI (-D style via ENVIRONMENT)
 * 3. environments/{profile}.override.properties (optional)
 * 4. environments/local.override.properties (optional, gitignored)
 * 5. environments/{profile}.properties
 * 6. config.properties
 *
 * Select profile with ENVIRONMENT=staging or environment=staging in config.
 */
function toEnvKey(propertyKey) {
  return propertyKey.replace(/\./g, "_").toUpperCase();
}

function isPresent(value) {
  return value != null && String(value).trim() !== "";
}

function parseProperties(content) {
  const props = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    props[key] = value;
  }
  return props;
}

function loadResource(target, resourcePath) {
  const fullPath = path.join(RESOURCES_DIR, resourcePath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, "utf8");
  Object.assign(target, parseProperties(content));
}

function resolveProfile() {
  if (isPresent(process.env.ENVIRONMENT)) return process.env.ENVIRONMENT.trim();
  if (isPresent(process.env.environment)) return process.env.environment.trim();
  return "local";
}

function load() {
  const props = {};
  const profile = resolveProfile();

  loadResource(props, "config.properties");
  loadResource(props, `environments/${profile}.properties`);
  loadResource(props, `environments/${profile}.override.properties`);
  loadResource(props, "environments/local.override.properties");

  props.environment = profile;
  return props;
}

const PROPERTIES = load();

export function environment() {
  return get("environment", "local");
}

export function get(key, defaultValue = null) {
  const fromEnv = process.env[toEnvKey(key)];
  if (isPresent(fromEnv)) return fromEnv.trim();

  const fromProcess = process.env[key];
  if (isPresent(fromProcess)) return fromProcess.trim();

  const fromFile = PROPERTIES[key];
  if (isPresent(fromFile)) return fromFile.trim();

  return defaultValue;
}

export function getBoolean(key, defaultValue) {
  const value = get(key, String(defaultValue));
  return value === "true" || value === "1";
}

export function getInt(key, defaultValue) {
  const value = get(key, String(defaultValue));
  return Number.parseInt(value, 10);
}
