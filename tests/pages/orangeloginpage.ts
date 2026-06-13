import { Page,Locator } from '@playwright/test';

export class LoginPage {

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

    async login(
        username: string,
        password: string
    ) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}