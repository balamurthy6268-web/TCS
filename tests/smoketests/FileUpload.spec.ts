import { test, expect } from '@playwright/test';

test('File Upload', async ({ page }) => {

    await page.goto(
        'https://the-internet.herokuapp.com/upload'
    );

    await page.locator('#file-upload')
        .setInputFiles('data/Users.json'); //for multiple files, use an array of file paths or give comma separated files 


    await page.locator('#file-submit').click();

    await expect(page.locator('h3'))
        .toHaveText('File Uploaded!');
});