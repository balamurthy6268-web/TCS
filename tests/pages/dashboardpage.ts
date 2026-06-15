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

    //getter method to check if the dashboard header is visible
    async isDashboardHeaderVisible() : Promise<boolean> {
     await this.dashboardHeader.waitFor({
        state: 'visible'
    });

    return await this.dashboardHeader.isVisible();
    }
    
}