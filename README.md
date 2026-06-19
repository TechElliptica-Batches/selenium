# Selenium E2E Framework — Learning User Management

Java **Selenium WebDriver** + **TestNG** + **Maven** framework for the same frontend covered by the Playwright suite in [`playwright/`](playwright/).

## Prerequisites

- **Java 17+**
- **Maven 3.9+**
- App stack running (see root [README](../README.md))

## Setup

Configuration uses **property files** under `src/test/resources/environments/`.

```bash
# Default profile is local — no extra setup required
mvn test
```

For machine-specific overrides (optional):

```bash
cp src/test/resources/environments/local.override.properties.example \
   src/test/resources/environments/local.override.properties
# edit local.override.properties
```

## Run tests

```bash
mvn test                                    # local profile (default)
mvn test -Denvironment=staging              # staging profile
mvn test -Dtest=LoginTest                   # single class
mvn test -Dheadless=true                    # override property via JVM flag
BASE_URL=http://localhost:5173 mvn test     # override via env var alias
```

## Environment property files

```plaintext
selenium/src/test/resources/
├── config.properties                 # shared defaults
└── environments/
    ├── local.properties              # default local dev
    ├── staging.properties            # example staging profile
    ├── local.override.properties     # optional, gitignored
    └── local.override.properties.example
```

### Resolution order (highest wins)

1. OS environment variable (`BASE_URL`, `ADMIN_EMAIL`, …)
2. JVM system property (`-Dbase.url=…`, `-Denvironment=staging`)
3. `environments/{profile}.override.properties` (if present)
4. `environments/local.override.properties` (if present)
5. `environments/{profile}.properties`
6. `config.properties`

Select profile with `-Denvironment=staging` or `ENVIRONMENT=staging`.

### Property keys

| Property key | Env var alias | Default (local) | Description |
|--------------|---------------|-----------------|-------------|
| `base.url` | `BASE_URL` | `http://localhost:5173` | Frontend URL |
| `users.api.base.url` | `USERS_API_BASE_URL` | `http://localhost:4000/api` | Users API |
| `products.api.base.url` | `PRODUCTS_API_BASE_URL` | `http://localhost:4001/api` | Products API |
| `admin.email` | `ADMIN_EMAIL` | `admin@acme.test` | Login email |
| `admin.password` | `ADMIN_PASSWORD` | `admin123` | Login password |
| `headless` | `HEADLESS` | `false` | Headless Chrome |
| `browser` | `BROWSER` | `chrome` | Browser name |
| `explicit.wait.seconds` | `EXPLICIT_WAIT_SECONDS` | `15` | WebDriverWait timeout |

## Project structure

```plaintext
selenium/
├── pom.xml
├── src/test/java/com/automation/um/
│   ├── config/Config.java, EnvironmentConfig.java
│   ├── core/BaseTest.java, DriverFactory.java
│   ├── pages/
│   ├── utils/
│   └── tests/
└── src/test/resources/
    ├── config.properties
    ├── environments/
    └── testng.xml
```

## Design patterns

- **Property-file environments** — `EnvironmentConfig` loads profile-based `.properties`
- **Page Object Model** — UI locators and actions in `pages/`
- **BaseTest** — WebDriver lifecycle and shared page objects
- **WebDriverManager** — automatic ChromeDriver setup
- **ApiClient** — REST helpers for setup/teardown

## Azure DevOps CI

Playwright E2E pipeline: [`azure-pipelines.yml`](azure-pipelines.yml) — runs all 54 tests, publishes JUnit + HTML report.

```bash
# Pipeline path when creating in Azure DevOps:
/azure-pipelines.yml
```

See [playwright/README.md](playwright/README.md#azure-devops-pipeline) for variable setup.

## Sample credentials

- Email: `admin@acme.test`
- Password: `admin123`
