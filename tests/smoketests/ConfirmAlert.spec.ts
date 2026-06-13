
import { test, expect } from '@playwright/test';

test('Confirm Alert', async ({ page }) => {

    await page.goto(
        'https://the-internet.herokuapp.com/javascript_alerts'
    );

    page.on('dialog', async dialog => {

        console.log(dialog.message());

        await dialog.dismiss();
    });

    await page.getByText('Click for JS Confirm')
        .click();
});