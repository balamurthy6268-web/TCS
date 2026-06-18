import { Page, Locator, expect } from '@playwright/test';

export default class orangeLoginPage {
    private page: Page;
    private username: Locator;
    private password: Locator;
    private loginButton: Locator;

    constructor( page: Page) {
        this.page = page;
        this.username = this.page.locator('input[name="username"]');
        this.password = this.page.locator('input[name="password"]');
        this.loginButton = this.page.locator(
            'button[type="submit"]'
        );
    }

    // Method to perform login action     

    async dologin(username: string, password: string): Promise<boolean> {
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
    //check the position of the Username box in the UI.
    //It should be present in the same location as expected in the x and y coordinates

    async chkUsernamePosition(): Promise<boolean> {
        await this.username.waitFor({ state: 'visible' });
        const box = await this.username.boundingBox();
        console.log(box?.x);
        console.log(box?.y);

        return ((box?.x ?? 0) >= 300 && (box?.y ?? 0) >= 355);
    }
}