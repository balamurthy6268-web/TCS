import { test, expect } from '@playwright/test';
//a home page smoke tests one each for checking username textbox is available and one test for if password is a type password box

//for each test load the home page url

test.beforeEach (async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
});

test.describe(' @smoke un pw object check', () => {

test('check username', async ({ page }) => {
await expect (page.getByRole('textbox', { name: 'Username' })).toBeVisible();

});

test('check password type', async ({ page }) => {
    await expect (page.getByRole('textbox', { name: 'Password' })).toHaveAttribute('type', 'password');
});
});

test.describe('logo tests', () => {

//check position of the logo 

test.only ('check the logo is present', async ({ page }) => {
await expect (page.getByRole('img', { name: 'company-branding' })).toBeVisible();
});

//check if the logo or branding image is the first image
test ('check if logo is the first image @smoke', async ({page}) => {
const firstImage = await page.locator('img').first();
await expect(firstImage).toHaveAttribute('alt', 'company-branding');    
 

});
});