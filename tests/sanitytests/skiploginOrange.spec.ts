import { test, expect} from '@playwright/test';
//if you are using global-setup.ts to setup storage state , use test.use({storageState:'storage/.auth/orangehrm-auth.json'}) to use the storage state in your test file

test('skiplogin Storage State Session Test for Orange hrm', async ({ page }) => {
    
   console.log(`Test starts with ${process.env.BASE_URL} dashboard page`);

      await page.goto('/');
      await expect(page).toHaveURL(/.*dashboard.*/);

      console.log("Test ends");

});
