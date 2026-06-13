import { test as base,Page } from '@playwright/test';

type MyFixtures = {
    loggedInPage: Page;
};

export const test =
    base.extend<MyFixtures>({

        loggedInPage:
        async ({ page }: { page: Page }, use: any) => {

            await page.goto(
                'https://opensource-demo.orangehrmlive.com/'
            );

            await page
                .locator('input[name="username"]')
                .fill('Admin');

            await page
                .locator('input[name="password"]')
                .fill('admin123');

            await page
                .locator('button[type="submit"]')
                .click();

            await use(page);
        }
    });

export { expect } from '@playwright/test';