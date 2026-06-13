import { test, expect } from '@playwright/test';

test('Simple Alert', async ({ page }) => {

    await page.goto(
        'https://the-internet.herokuapp.com/javascript_alerts'
    );

    page.on('dialog', async dialog => {

        console.log(dialog.message());

        await dialog.accept();
    });

    await page.getByText('Click for JS Alert')
        .click();
});