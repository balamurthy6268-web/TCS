import { test, chromium } from '@playwright/test';

test('Reuse Edge Session', async () => {

    const context = await chromium.launchPersistentContext(
        './edge-profile',
        {
            channel: 'msedge',
            headless: false
        }
    );

    const page = context.pages()[0];

    await page.goto('https://github.com');

    console.log(await page.title());

    await context.close();
});
