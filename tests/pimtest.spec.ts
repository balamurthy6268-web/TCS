import {
    test,
    expect
} from './fixtures/orangeloggedin.fixture';

test(
    'Navigate to PIM',
    async ({ loggedInPage }) => {

        await loggedInPage
            .getByRole('link', { name: 'PIM' })
            .click();

        await expect(loggedInPage)
            .toHaveURL(/pim/);
    }
);