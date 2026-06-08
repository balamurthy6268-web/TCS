import { test } from '@playwright/test';
import { clickElement } from './utils/Unionselector';

test('Union Type Locator Example', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  clickElement(page, 'css', '#login-button');

  // TypeScript error
  // await clickElement(page, 'id', 'login-button');
});