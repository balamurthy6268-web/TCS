import { test, expect } from '@playwright/test';

test('Handle Frame', async ({ page }) => {

    await page.goto('https://demoqa.com/frames');

    const frame = page.frameLocator('#frame1');

    console.log(
        await frame.locator('h1#sampleHeading').textContent()
    );

    await expect(
        page.locator('h1')
    ).toHaveText('Frames');
    await expect(
        frame.locator('h1#sampleHeading')
    ).toHaveText('This is a sample page');

    page.close();
    
});