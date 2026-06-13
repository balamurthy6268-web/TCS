
// login.spec.ts

import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { DataHelper } from '../utils/DataHelper';

interface User {
  username: string;
  password: string;
}

const users = DataHelper.createDataList<User>([
    {
        username: 'Admin',
        password: 'admin123'
    },
    {
        username: 'manager',
        password: 'manager123'
    }
]);
let loginsuccess: boolean = false;

for (const user of users) {

 test(`Login test for ${user.username}-${user.password}`, async ( {page}) => {
    const browser: Browser = await chromium.launch({
      headless: false
    });

    const context: BrowserContext = await browser.newContext();
    // const page: Page = await context.newPage();
    const loginPage = new LoginPage();

      await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
      loginsuccess= await loginPage.login(page, user);

       expect(loginsuccess).toBeTruthy();


      

 });
}

