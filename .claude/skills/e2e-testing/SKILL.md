---
name: e2e-testing
description: Playwright E2E testing patterns — Page Object Model, accessible selectors, cross-browser
triggers:
  - /e2e
  - playwright
  - e2e test
  - end to end test
applies_to: ["**/e2e/**/*.ts", "**/e2e/**/*.spec.ts"]
---

# E2E Testing Skill (Playwright)

## Page Object Model

Every page gets a PO class that encapsulates selectors and actions:

```typescript
// e2e/pages/BasePage.ts
import { type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
```

```typescript
// e2e/pages/DashboardPage.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly heading: Locator;
  private readonly userMenu: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.userMenu = page.getByRole('button', { name: /user menu/i });
    this.searchInput = page.getByRole('searchbox');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/dashboard');
  }

  async isVisible(): Promise<boolean> {
    return this.heading.isVisible();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }
}
```

## Test Patterns

### Critical User Flow

```typescript
test.describe('User CRUD Flow', () => {
  test('creates, views, edits, and deletes a user', async ({ page }) => {
    const listPage = new UserListPage(page);
    const formPage = new UserFormPage(page);

    // Create
    await listPage.goto();
    await listPage.clickCreateNew();
    await formPage.fillForm({ name: 'Test User', email: 'test@example.com' });
    await formPage.submit();
    await expect(page.getByText('User created')).toBeVisible();

    // Read
    await expect(listPage.getRow('Test User')).toBeVisible();

    // Update
    await listPage.clickEdit('Test User');
    await formPage.fillForm({ name: 'Updated User' });
    await formPage.submit();
    await expect(listPage.getRow('Updated User')).toBeVisible();

    // Delete
    await listPage.clickDelete('Updated User');
    await listPage.confirmDelete();
    await expect(listPage.getRow('Updated User')).not.toBeVisible();
  });
});
```

### Responsive Test

```typescript
test.describe('Responsive Layout', () => {
  test('mobile nav uses hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await expect(page.getByRole('navigation')).not.toBeVisible();
  });

  test('desktop nav is always visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

## Selector Priority

1. `getByRole` — ARIA roles (button, heading, textbox, link)
2. `getByLabel` — Form input labels
3. `getByPlaceholder` — Input placeholders
4. `getByText` — Visible text content
5. `getByTestId` — Last resort only

## Rules

1. Never use CSS selectors — always use accessible locators
2. Never use `page.waitForTimeout()` — use Playwright's auto-waiting
3. Every test is independent — no shared state between tests
4. Test happy path AND error path for every flow
5. Cross-browser: Chromium + Firefox + Mobile Safari minimum
