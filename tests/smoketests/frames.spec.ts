import { test, expect } from '@playwright/test';

test('Handle Frame', async ({ page }) => {

    await page.goto('https://demoqa.com/frames');

    const frame = page.frameLocator('#frame1');

    await expect(
        frame.locator('#sampleHeading')
    ).toHaveText('This is a sample page');
});