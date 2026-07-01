import { test as base, BrowserContext } from '@playwright/test';

type WorkerFixtures = {
    loggedincontext: BrowserContext;
};

export const test = base.extend<{}, WorkerFixtures>({

    loggedincontext: [ async ({ browser }, use) => {

        const context = await browser.newContext();

        const page = await context.newPage();

        //await page.goto('/web/index.php/auth/login');
        await page.goto('/');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');

        await page.getByRole('button', { name: 'Login' }).click();

        await page.waitForURL(/dashboard/);

        await use(context);

        await context.close();

    }, {scope : 'worker'}]

});

export { expect } from '@playwright/test';