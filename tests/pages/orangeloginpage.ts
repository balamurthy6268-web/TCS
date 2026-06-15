import { Page,Locator,expect } from '@playwright/test';

export class orangeLoginPage {

    username: Locator;
    password: Locator;
    loginButton: Locator;

    constructor(private page: Page) {
        this.username = this.page.locator('input[name="username"]');
        this.password = this.page.locator('input[name="password"]');
        this.loginButton = this.page.locator(
            'button[type="submit"]'
        );
    }

  // Method to perform login action     

    async dologin(
        username: string,
        password: string
    ): Promise<boolean> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        try {
            await expect(this.page).toHaveURL(/dashboard/);
            return true;
        } catch (error) {
            return false;
        }
    }
}