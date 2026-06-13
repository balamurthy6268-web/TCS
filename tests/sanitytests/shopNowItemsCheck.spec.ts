//check for shop now featured categories
//in advantageonlineshopping website

import { test, expect, Locator } from '@playwright/test';

test.describe('check for shop now featured categories', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://advantageonlineshopping.com/#/');
        console.log("Test started");
    });

    test('check for shop now featured categories', async ({ page }) => {
       // const shopNow = await page.locator("//*[text()='Shop Now']/preceding-sibling::span").allTextContents();
        await page.waitForSelector('xpath=//div[contains(@class,"rowSection")]//span[normalize-space()="SPEAKERS"]');
        const expectedCategories = ['SPEAKERS', 'TABLETS', 'LAPTOPS', 'MICE', 'HEADPHONES'];
        const categories: Locator = page.locator('xpath=//div[contains(@class,"rowSection")]//span[normalize-space() = "SPEAKERS" or normalize-space() = "TABLETS" or normalize-space() = "LAPTOPS" or normalize-space() = "MICE" or normalize-space() = "HEADPHONES"]');
        console.log(await page.title());

        const categoryTexts = (await categories.allTextContents())
            .map(text => text.trim())
            .filter(text => text.length > 0);

        console.log('Number of Shop Now categories displayed:', categoryTexts.length, " ", categoryTexts);

        await expect.soft(categories).toHaveCount(expectedCategories.length);
        console.log('Expected Shop Now categories:', expectedCategories);
        console.log('First category to be displayed:', categoryTexts[0]);
        expect(categoryTexts[0]).toBe('SPEAKERS'); 

        console.log('Actual Shop Now categories:', categoryTexts);
        expect(categoryTexts).toEqual(expectedCategories);
    });
});
