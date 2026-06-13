import { test, expect } from '@playwright/test';

test('Handle New Tab', async ({ page }) => {

    await page.goto('https://demoqa.com/browser-windows');

    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.getByRole('button', { name: 'New Tab' }).click()
    ]);

    await newPage.waitForLoadState();

    const heading =
        await newPage.locator('#sampleHeading').textContent();

    console.log(heading);

    await expect(
        newPage.locator('#sampleHeading')
    ).toContainText('This is a sample page');
});