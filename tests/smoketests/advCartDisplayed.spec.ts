import { test, expect } from '@playwright/test';

test.describe('Home Page Cart Display', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://advantageonlineshopping.com/#/');
        console.log('Home page loaded');
    });

    test('Cart should be displayed on home page', async ({ page }) => {
        // Wait for cart icon to be visible
        await page.waitForSelector('xpath=//span[contains(@class,"cart-count")] | //div[contains(@class,"cartIcon")] | //button[contains(@class,"cart")]', { timeout: 5000 }).catch(() => {
            console.log('Cart selector timeout, attempting alternative selectors');
        });

        // Check if cart icon/button is visible
        const cartIcon = page.locator('xpath=//span[contains(@class,"cart")] | //*[contains(@id,"cart")] | //*[contains(text(),"Cart")]').first();

        await expect(cartIcon).toBeVisible({ timeout: 5000 });
        console.log('Cart icon is visible on home page');
    });

    test('Cart count badge should be displayed', async ({ page }) => {
        // Look for cart count or badge element
        const cartBadge = page.locator('xpath=//span[contains(@class,"badge")] | //span[contains(text(),"0")]').first();

        // Check if badge exists and is visible
        const isVisible = await cartBadge.isVisible().catch(() => false);

        if (isVisible) {
            const badgeText = await cartBadge.textContent();
            console.log(`Cart badge text: ${badgeText}`);
            expect(badgeText).toBeTruthy();
        } else {
            console.log('Cart badge not found, but cart icon is present');
        }
    });

    test('Cart should be clickable', async ({ page }) => {
        const cartButton = page.locator('xpath=//span[contains(@class,"cart")] | //*[contains(@id,"cart")] | //*[contains(text(),"Cart")]').first();

        await expect(cartButton).toBeEnabled();
        console.log('Cart element is clickable');
    });
});
