//use the page object orangeloginpage.ts
//call the login method from the page object and pass the username and password as parameters
//assert the login is successful by checking the presence of the dashboard page 

import { test,expect } from '@playwright/test';
import { orangeLoginPage } from '../pages/orangeloginpage';
import { DataHelper } from '../utils/DataHelper';   
import { DashboardPage } from '../pages/dashboardpage';

test('Orange Login Test using Page Object model', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');  

    const user = DataHelper.createData({
        username: 'Admin',
        password: 'admin123'
    });

    const orangeloginPage  = new orangeLoginPage(page);
    
    const loginSuccess =
    await orangeloginPage.dologin(user.username, user.password);
    
    
    console.log('Login successful:', loginSuccess);

    if (loginSuccess) {
    const dashboardPage = new DashboardPage(page);

    
    // Assert that the dashboard page is visible after login

    const isDashboardVisible = await dashboardPage.isDashboardHeaderVisible();
    console.log('Is Dashboard Header Visible:', isDashboardVisible);

    expect(await dashboardPage.isDashboardHeaderVisible()).toBe(true);
    }
    else
    {
        console.error(`Login failed for \`${user.username}\` \`${user.password}\`. Dashboard page is not visible.`);
        expect(loginSuccess).toBe(true); // This will fail the test if login is unsuccessful
    }
});



