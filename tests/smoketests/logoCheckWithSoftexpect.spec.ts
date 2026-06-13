//logo check on advantageonlineshopping.com

import { test, expect } from '@playwright/test';

test.describe('logo check on advantageonline shopping website', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://advantageonlineshopping.com/#/');
    });


    test('logo check', async ({ page }) => {
       // const logo = await page.locator('xpath=//img[@class="logo"]');
        const logo1 = await page.locator('xpath=//div[@class="login ng-scope"]/child::img').getAttribute('src');

        //with absolute xpath

        const logoimg = await page.locator('xpath=/html/body/div[1]/div[1]/div[1]/div[1]/img');
        expect(logoimg).toBeVisible();

        expect.soft(page.locator('xpath=//*[text()="MY PRODUCTS"]')).toBeVisible();

        expect(logo1).toContain('logo.png');     
           
        console.log("Test over");
    });
});