import { test, expect } from "@playwright/test";

test.describe("SauceDemo - Price Sort Low to High", () => {
  test("should login, sort items by price low to high, and verify order", async ({
    page,
  }) => {
    // ── 1. Navigate & Login ──────────────────────────────────────────────────
    await page.goto("https://www.saucedemo.com/");

    await page.locator("#user-name").fill("standard_user");
    await page.locator("#password").fill("secret_sauce");
    await page.locator("#login-button").click();

    // Verify successful login by confirming we're on the inventory page
    await expect(page).toHaveURL(/.*inventory/);
    console.log("✅ Login successful");

    // ── 2. Sort by Price (Low to High) ──────────────────────────────────────
    const sortDropdown = page.locator(".product_sort_container");
    await sortDropdown.selectOption("lohi");

    console.log("✅ Sort applied: Price (Low to High)");

    // ── 3. Collect displayed prices ─────────────────────────────────────────
    const priceLocators = page.locator(".inventory_item_price");
    await expect(priceLocators.first()).toBeVisible();

    const priceTexts = await priceLocators.allTextContents();

    // Strip the "$" and convert to numbers
    const prices = priceTexts.map((p) => parseFloat(p.replace("$", "")));
    console.log("Displayed prices:", prices);

    // ── 4. Assert prices are in ascending order ──────────────────────────────
    for (let i = 0; i < prices.length - 1; i++) {
      const current = prices[i];
      const next = prices[i + 1];

      console.log(`  Comparing item[${i}] $${current} ≤ item[${i + 1}] $${next}`);

      expect(
        current,
        `Price at position ${i} ($${current}) should be ≤ price at position ${i + 1} ($${next})`
      ).toBeLessThanOrEqual(next);
    }

    console.log("✅ All items are correctly sorted by price (low to high)");
  });
});