import { test as base } from '@playwright/test';

import { LoginPage } from '../pages/orangeloginpage';
import { DashboardPage } from '../pages/dashboardpage';

type OrangeHRMFixtures = {

    loginPage: LoginPage;

    dashboardPage: DashboardPage;

    credentials: {
        username: string;
        password: string;
    };
};

export const test =
    base.extend<OrangeHRMFixtures>({

        credentials: async ({}, use) => {

            await use({
                username: 'Admin',
                password: 'admin123'
            });
        },

        loginPage: async ({ page }, use) => {

            await use(
                new LoginPage(page)
            );
        },

        dashboardPage: async ({ page }, use) => {

            await use(
                new DashboardPage(page)
            );
        }
    });

export { expect } from '@playwright/test';