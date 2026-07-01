import { chromium } from '@playwright/test';

export default async function globalSetup()
 {
  const browser = await chromium.launch({
  headless: true
});
  
   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  
    // Fill login details
  
  await page.getByRole('textbox', { name: 'username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin123');
  await page.locator('.orangehrm-login-button').click();

  // Wait until login completes
//  await page.waitForSelector('#logout2', { timeout: 10000 });

            await page.getByRole('listitem').locator('i').click();
            await page.waitForSelector('#app > div.oxd-layout.orangehrm-upgrade-layout > div.oxd-layout-navigation > header > div.oxd-topbar-header > div.oxd-topbar-header-userarea > ul > li > ul > li:nth-child(4) > a' ,{timeout:1000});
  // Save storage state
  await context.storageState({
    path: 'storage/orangehrm-auth.json'
  });

  await browser.close();
}

