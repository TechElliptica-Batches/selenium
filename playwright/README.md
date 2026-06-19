# Playwright E2E Framework — Learning User Management

JavaScript **Playwright** framework for the same frontend covered by the Selenium suite. Mirrors Selenium patterns: property-file environments, Page Object Model, API hybrid testing, and module-based test organization.

## Prerequisites

- **Node.js** v20.19+ or v22+
- App stack running (see root [README](../../README.md))

## Setup

Configuration uses **property files** under `resources/environments/` (same model as Selenium).

```bash
npm install
npx playwright install
```

For machine-specific overrides (optional):

```bash
cp resources/environments/local.override.properties.example \
   resources/environments/local.override.properties
# edit local.override.properties
```

## Run tests

```bash
npm test                                    # local profile (default)
ENVIRONMENT=staging npm test                # staging profile
HEADLESS=true npm test                      # override via env var
npx playwright test tests/auth/login.spec.js  # single file

npm run test:headed      # headed browser
npm run test:ui          # Playwright UI mode
npm run test:auth        # by module
npm run report           # HTML report
```

## Environment property files

```plaintext
playwright/resources/
├── config.properties                 # shared defaults
└── environments/
    ├── local.properties              # default local dev
    ├── staging.properties            # example staging profile
    ├── local.override.properties     # optional, gitignored
    └── local.override.properties.example
```

### Resolution order (highest wins)

1. OS environment variable (`BASE_URL`, `ADMIN_EMAIL`, …)
2. `process.env` key
3. `environments/{profile}.override.properties` (if present)
4. `environments/local.override.properties` (if present)
5. `environments/{profile}.properties`
6. `config.properties`

Select profile with `ENVIRONMENT=staging`.

## Project structure

```plaintext
playwright/
├── config/                    # EnvironmentConfig + typed Config
├── fixtures/index.js          # Custom fixtures (mirrors BaseTest)
├── pages/                     # Page Object Model + components/
├── utils/                     # apiClient, testDataFactory, waitUtils
├── resources/                 # Property files (environments)
├── tests/                     # Feature modules: auth, dashboard, users, …
├── rules.context              # AI test generation rules
├── global-setup.js
└── playwright.config.js
```

## Design patterns

- **Property-file environments** — same resolution order as Selenium `EnvironmentConfig`
- **Page Object Model** — UI locators and actions in `pages/`
- **Custom fixtures** — `loginAsAdmin`, `clearSession`, `apiAuth`, all page objects
- **ApiClient** — REST helpers for setup/teardown
- **TestDataFactory** — dynamic user builders (no external data files)
- **`data-testid` selectors** — aligned with the frontend test hooks

## AI test generation

Use `rules.context` in prompts to generate new tests that follow framework conventions.

## Azure DevOps Pipeline

Two pipeline files are available at the repo root (`selenium/`):

| File | Use when |
|------|----------|
| [`../azure-pipelines.yml`](../azure-pipelines.yml) | App is already deployed (staging/CI URLs via pipeline variables) |
| [`azure-pipelines-local-stack.yml`](azure-pipelines-local-stack.yml) | Agent starts api-practice app stack before tests |

### Quick setup (deployed environment)

1. **Pipelines** → **New pipeline** → select repo → **Existing Azure Pipelines YAML file** → `/azure-pipelines.yml`
2. Add pipeline variables:

| Variable | Example |
|----------|---------|
| `BASE_URL` | `https://your-frontend.azurewebsites.net` |
| `USERS_API_BASE_URL` | `https://your-users-api.azurewebsites.net/api` |
| `PRODUCTS_API_BASE_URL` | `https://your-products-api.azurewebsites.net/api` |
| `ADMIN_PASSWORD` | *(mark as secret)* |

3. Run pipeline — parameters: **environment**, **test scope** (all/auth/users/…), **publish report**

### Pipeline outputs

- **Tests** tab — JUnit results (54 test cases)
- **Artifacts** — `playwright-html-report`, `playwright-test-results` (on failure: screenshots, traces, video)

## Sample credentials

- Email: `admin@acme.test`
- Password: `admin123`
