import { test, expect, Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Credentials dataset
// ---------------------------------------------------------------------------
interface Credential {
  username: string;
  password: string;
  expectedOutcome: "success" | "failure";
  description: string;
}

const credentials: Credential[] = [
  {
    username: "standard_user",
    password: "secret_sauce",
    expectedOutcome: "success",
    description: "Standard user – valid login",
  },
  {
    username: "locked_out_user",
    password: "secret_sauce",
    expectedOutcome: "failure",
    description: "Locked-out user – should be blocked",
  },
  {
    username: "problem_user",
    password: "secret_sauce",
    expectedOutcome: "success",
    description: "Problem user – valid login with known UI bugs",
  },
  {
    username: "performance_glitch_user",
    password: "secret_sauce",
    expectedOutcome: "success",
    description: "Performance glitch user – valid but slow login",
  },
  {
    username: "error_user",
    password: "secret_sauce",
    expectedOutcome: "success",
    description: "Error user – valid login",
  },
  {
    username: "visual_user",
    password: "secret_sauce",
    expectedOutcome: "success",
    description: "Visual user – valid login",
  },
  {
    username: "invalid_user",
    password: "wrong_password",
    expectedOutcome: "failure",
    description: "Invalid credentials – should show error message",
  },
];

// ---------------------------------------------------------------------------
// Page Object – Login Page
// ---------------------------------------------------------------------------
class LoginPage {
  constructor(private page: Page) {}

  // Locators
  private usernameInput = () => this.page.locator("#user-name");
  private passwordInput = () => this.page.locator("#password");
  private loginButton = () => this.page.locator("#login-button");
  private errorMessage = () => this.page.locator('[data-test="error"]');
  private inventoryTitle = () =>
    this.page.locator(".title", { hasText: "Products" });

  async navigate() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async fillUsername(username: string) {
    await this.usernameInput().fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async clickLogin() {
    await this.loginButton().click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage().textContent()) ?? "";
  }

  async isOnInventoryPage(): Promise<boolean> {
    try {
      await this.inventoryTitle().waitFor({ timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage().isVisible();
  }

  async logout() {
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#logout_sidebar_link").click();
  }
}

// ---------------------------------------------------------------------------
// Tests – iterate over the credentials array
// ---------------------------------------------------------------------------
test.describe("SauceDemo Login – Data-Driven Tests", () => {
  for (const cred of credentials) {
    test(`[${cred.expectedOutcome.toUpperCase()}] ${cred.description}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      // ── Navigate ──────────────────────────────────────────────────────────
      await loginPage.navigate();

      // Verify the login page loaded
      await expect(page).toHaveURL("https://www.saucedemo.com/");
      await expect(page.locator("#login-button")).toBeVisible();

      // ── Perform login ─────────────────────────────────────────────────────
      await loginPage.login(cred.username, cred.password);

      // ── Assert expected outcome ───────────────────────────────────────────
      if (cred.expectedOutcome === "success") {
        // Should land on inventory page
        const onInventory = await loginPage.isOnInventoryPage();
        expect(
          onInventory,
          `Expected "${cred.username}" to reach the inventory page`
        ).toBe(true);

        await expect(page).toHaveURL(/.*inventory\.html/);

        // Clean up: log out so next iteration starts fresh
        await loginPage.logout();
        await expect(page).toHaveURL("https://www.saucedemo.com/");
      } else {
        // Should stay on login page and show an error
        const errorVisible = await loginPage.isErrorVisible();
        expect(
          errorVisible,
          `Expected an error message for "${cred.username}"`
        ).toBe(true);

        const errorText = await loginPage.getErrorMessage();
        expect(errorText.length).toBeGreaterThan(0);

        // URL should NOT have changed to inventory
        expect(page.url()).not.toContain("inventory.html");
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Bonus: grouped snapshot test – log in with each valid user and capture title
// ---------------------------------------------------------------------------
test.describe("SauceDemo – Inventory Page Title per Valid User", () => {
  const validUsers = credentials.filter((c) => c.expectedOutcome === "success");

  for (const cred of validUsers) {
    test(`Inventory page title visible for "${cred.username}"`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(cred.username, cred.password);

      const title = page.locator(".title");
      await expect(title).toBeVisible({ timeout: 8000 });
      await expect(title).toHaveText("Products");

      await loginPage.logout();
    });
  }
});
