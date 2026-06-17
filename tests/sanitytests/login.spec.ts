// login.spec.ts

import { test,expect } from '@playwright/test';
import { LoginPage } from '../Modules/loginpage';
import { DataHelper } from '../utils/DataHelper';

test('Module Login Test', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    const user = DataHelper.createData({
        username: 'Wronguser',
        password: 'wrongpassword'
    });

    const loginPage = new LoginPage();

    const success = await loginPage.login(page, user);
    
    expect(success).toBe(true);


});