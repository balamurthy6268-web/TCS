import { test, expect } from '@playwright/test';
import orangeLoginPage from '../pages/orangeloginpage'

test.describe('Home Page UI position check', () => {
    let lp: orangeLoginPage;

    test.beforeAll (async ({page}) => {

         lp = new orangeLoginPage(page);

    });
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        console.log('OrangeHRM Home page loaded');

           });

    test('UI Test case Username position check', async ({ page }) => {
        let poschk :boolean = false;

        poschk = await lp.chkUsernamePosition();

        expect(poschk).toBe(true);
    });
});
