import { test, expect } from '@playwright/test';

test('Login', async ({ page }, testInfo) => {

    //await page.goto('/');
    const baseURL = testInfo.project.use.baseURL;
    //await page.goto(process.env.BASE_URL!);
    console.log('Base URL:', baseURL);
    console.log('Username:', process.env.DEMOBLAZE_USERNAME!);
    console.log(process.env.DEMOBLAZE_PASSWORD!);

});
