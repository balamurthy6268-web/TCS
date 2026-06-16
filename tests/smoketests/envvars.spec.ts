import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {

    //await page.goto('/');
    console.log('Base URL:', process.env.BASE_URL!);
    console.log(process.env.DEMOBLAZE_USERNAME!);
    console.log(process.env.DEMOBLAZE_PASSWORD!);

});
