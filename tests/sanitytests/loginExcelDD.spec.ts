import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { DataHelper } from '../utils/DataHelper';
import { LoginPage } from '../Modules/loginpage';


//const testData = readExcel('data/testdata.xlsx', 'Sheet1');
  const testData = DataHelper.readExcel <{ username: string; password: string }>(
    'data/testdata.xlsx',
    'Sheet1'
  );

let loginsuccess: boolean = false;

  for (const data of testData as any[]) {
  test(`Login test for ${data.username}` + `-${data.password}`, async () => {
    // Launch Browser
    const browser: Browser = await chromium.launch({
     headless: false
    });

    // Create Browser Context
    const context: BrowserContext = await browser.newContext();

    // Create New Page
    const page: Page = await context.newPage();
    const loginPage = new LoginPage();

    // Navigate to Login Page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    // Perform Login
    loginsuccess= await loginPage.login(page, data);

       expect(loginsuccess).toBeTruthy();



  });
}