import { test, expect } from '@playwright/test'
import data from '../data/saucedemousers.json'

const users = data.users;

test.skip('Single Valid User Login Test', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.locator('[data-test="login-button"]').click();
    expect(page.locator('[data-test="title"]')).toContainText('Products')
})

//Data Driven Test for login
users.forEach((user: { username: string; password: string }, index: number) => {
    test(`Data Driven Valid Login Test- ${user.username} Iteration:  ${index + 1}`, async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
        await page.locator('[data-test="username"]').fill(user.username);
        await page.locator('[data-test="password"]').fill(user.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="title"]')).toBeVisible();
        await expect(page.locator('[data-test="title"]')).toContainText('Products');
    })
        
});
    
//Empty values check 
test.skip('Invalid Login -Negative Test - empty values', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    //check to see if error message is displayed when both username and password are empty


    await page.locator('[id="login-button"]').click();
    
    await expect(page.locator('[data-test="error"]'))
  .toHaveText('Epic sadface: Username is required');
});
    

