//file:///E:/BLaptop/TCS/simple.html

import { test, expect } from '@playwright/test';

test('Test simple login page', async ({ page }) => {
  await page.goto('file:///E:/BLaptop/TCS/simple.html',
    {
     timeout: 1200000, // 60 seconds
    } 
  );
  await page.getByRole('textbox', { name: 'un' }).click();
await page.getByRole('textbox', { name: 'un' }).fill ("bala");
await page.getByRole('textbox', { name: 'pw' }).fill ("something");

//expect password to be of type input password
const passwordInput = page.locator('//table[2]/tbody/tr[2]');
//table[@name="credentials"]/descendant::tr[2]/child::td[2]
  await expect(passwordInput).toHaveAttribute('type', 'password');

});

test('Welcome message check', async ({ page }) => {
  await page.goto('file:///E:/BLaptop/TCS/simple.html',
    {
     timeout: 1200000, // 60 seconds
    } 
  );

const heading = page.locator('//h1');
//table[@name="credentials"]/descendant::tr[2]/child::td[2]
  await expect(heading).toContainText(/Welcome$/);


});
