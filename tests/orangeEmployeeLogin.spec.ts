import {
    test,
    expect
} from './fixtures/orangehrm.fixture';

test(
    'Login to OrangeHRM',
    async ({
        page,
        loginPage,
        dashboardPage,
        credentials
    }) => {

        await page.goto(
            'https://opensource-demo.orangehrmlive.com/'
        );

        await loginPage.login(
            credentials.username,
            credentials.password
        );

        await expect(
            dashboardPage.dashboardHeader
        ).toBeVisible();
    }
);