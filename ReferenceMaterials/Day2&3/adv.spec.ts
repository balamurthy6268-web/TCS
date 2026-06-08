//open advantageonlineshopping.com website and check if there is a search box
//smoke test for search box existing or not

import { test, expect } from '@playwright/test';

test('should have a search box', async ({ page }) => {
    await page.goto('https://www.advantageonlineshopping.com/');
    await page.locator('[title="SEARCH"]').click();
    const searchBox = page.locator('#autoComplete');
    await expect(searchBox).toBeVisible({ timeout: 5000 });
});


//test to see if logo.png is the first image in the website
test('should have logo.png as the first image', async ({ page }) => {
    await page.goto('https://www.advantageonlineshopping.com/');
    const firstImage = page.locator('img').first();
    //check if the first image src contains logo.png
    await expect(firstImage).toHaveAttribute('src', /logo\.png/);
    //await expect(firstImage).toHaveAttribute('src', 'https://www.advantageonlineshopping.com/img/logo.png');
});
