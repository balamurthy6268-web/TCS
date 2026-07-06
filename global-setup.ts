import { chromium } from '@playwright/test';

export default async function globalSetup()
 {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  
  await page.goto('https://www.demoblaze.com');

  
  // Open login modal
  await page.click('#login2');

  // Fill login details
  await page.fill('#loginusername', 'balamurthy');
  await page.fill('#loginpassword', 'balamurthy');

  await page.click('button:has-text("Log in")');

  // Wait until login completes
  await page.waitForSelector('#logout2', { timeout: 10000 });

  // Save storage state
  await context.storageState({
    path: 'storage/demoblaze-auth.json'
  });

  await browser.close();
}

