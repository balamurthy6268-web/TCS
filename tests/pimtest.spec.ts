import {
    test,
    expect
} from './fixtures/orangeloggedin.fixture';

test(
    'Navigate to PIM',
    async ({ loggedincontext }) => {
        const loggedinpage = await loggedincontext.newPage();

        await loggedinpage.getByRole('link', { name: 'PIM' })
            .click();

        await expect(loggedinpage)
            .toHaveURL(/pim/);
    }
);