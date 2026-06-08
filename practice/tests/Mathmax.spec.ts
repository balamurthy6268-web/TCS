import { test, expect } from '@playwright/test';

test('find maximum price', async ({ page }) => {

    await page.goto('file:///e:/blaptop/tcs/products.html');

    const pricesText = await page
        .locator('#products tr td:nth-child(2)')
        .allTextContents();

    console.log(pricesText);

    const prices = pricesText.map(price =>
        Number(price.trim())
    );

    console.log(prices);

    const maxPrice = Math.max(...prices);

    console.log('Maximum Price:', maxPrice);
// can further use this logic to find if sorting is successful or not by comparing the max price with the
//  first price in the sorted list.   

    expect(maxPrice).toBe(45000);
});