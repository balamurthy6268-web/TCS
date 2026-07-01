// LoginPage.ts
import { expect } from '@playwright/test';
import { User } from '../User';

export class LoginPage {

    async login(
        page: any,
        user: Pick<User, 'username' | 'password'>
    ): Promise<boolean> {

        console.log(`Attempting login with username: ${user.username} and password: ${user.password}`);
        await page.getByRole('textbox', { name: 'username' }).fill(user.username);
        await page.getByRole('textbox', { name: 'password' }).fill(user.password);
        await page.locator('.orangehrm-login-button').click();
        try {
            await expect(page).toHaveURL(/.*dashboard.*/);

            console.log(`Login successful for ${user.username} with password ${user.password}`);
            await page.getByRole('listitem').locator('i').click();
            await page.getByRole('menuitem', { name: 'Logout' }).click();
            return true;
        } catch (error) {
            console.error(`Login failed for ${user.username} with password ${user.password}`);
            await page.screenshot({
                path: `screenshots/${user.username}-${user.password}-login-failure.png`,
                fullPage: true
            });
            return false;
        }
    }
}
