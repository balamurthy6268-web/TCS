import { Page,Locator } from '@playwright/test';

export class DashboardPage {

    dashboardHeader: Locator;
    pimMenu: Locator;
    adminMenu: Locator; 

    constructor(private page: Page) {

    this.dashboardHeader =
        this.page.getByRole('heading', {
            name: 'Dashboard'
        });

    this.pimMenu =
        this.page.getByRole('link', {
            name: 'PIM'
        });

    this.adminMenu =
        this.page.getByRole('link', {
            name: 'Admin'
        });
    }
}