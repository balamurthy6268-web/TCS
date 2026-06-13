import { test, expect } from '@playwright/test';

test('Prompt Alert', async ({ page }) => {

    await page.goto(
        'https://the-internet.herokuapp.com/javascript_alerts'
    );

    page.on('dialog', async dialog => {

        await dialog.accept('Playwright');
    });

    await page.getByText('Click for JS Prompt')
        .click();

    await expect(page.locator('#result'))
        .toContainText('Playwright');
});