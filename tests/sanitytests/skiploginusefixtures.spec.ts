import { test, expect } from '../fixtures/orangeloggedin.fixture';

test('Dashboard', async ({ loggedincontext }) => {

    const page = await loggedincontext.newPage();

    await page.goto('/web/index.php/dashboard/index');

     await expect(page).toHaveURL(/.*dashboard.*/);
});