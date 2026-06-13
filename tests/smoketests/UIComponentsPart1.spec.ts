import { test, expect } from '@playwright/test';

test.describe('Playwright Locator and Control Examples', () => {

    test('getByRole Locator', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');
        

        await page.getByRole('textbox', {
            name: 'Full Name'
        }).fill('Bala Murthy');

        await expect(
            page.getByRole('textbox', {
                name: 'Full Name'
            })
        ).toHaveValue('Bala Murthy');
    });

    test('CSS Selector', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');

        await page.locator('css=#userEmail')
            .fill('bala@test.com');

        await expect(
            page.locator('#userEmail')
        ).toHaveValue('bala@test.com');
    });

    test('XPath Locator', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');

        await page.locator("//input[@id='userName']")
            .fill('Bala');

        await expect(
            page.locator("//input[@id='userName']")
        ).toHaveValue('Bala');
    });

    test('Navigation Functions', async ({ page }) => {

        await page.goto('https://demoqa.com');

        await page.goto('https://demoqa.com/text-box');

        await page.goBack();

        await page.goForward();

        await page.reload();

        await expect(page)
            .toHaveURL(/text-box/);
    });

    test('Input Fields', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');

        await page.locator('#userName')
            .fill('Bala Murthy');

        await page.locator('#userEmail')
            .fill('bala@test.com');

        await expect(
            page.locator('#userName')
        ).toHaveValue('Bala Murthy');
    });

    test('Button Click', async ({ page }) => {

        await page.goto('https://demoqa.com/buttons');

        await page.getByRole('button', {
            name: 'Click Me'
        }).last().click();

        await expect(
            page.locator('#dynamicClickMessage')
        ).toBeVisible();
    });

    test('Radio Button', async ({ page }) => {

        await page.goto('https://demoqa.com/radio-button');

        await page.locator("label[for='yesRadio']")
            .click();

        await expect(
            page.locator('.text-success')
        ).toHaveText('Yes');
    });

    test('Checkbox', async ({ page }) => {

        await page.goto('https://demoqa.com/checkbox');

        await page.locator('.rct-checkbox')
            .first()
            .click();

        await expect(
            page.locator('#result')
        ).toContainText('home');
    });

    test('Dropdown', async ({ page }) => {

        await page.goto('https://demoqa.com/select-menu');

        await page.locator('#oldSelectMenu')
            .selectOption('Purple');

        await expect(
            page.locator('#oldSelectMenu')
        ).toHaveValue('4');
    });

    test('getByText Locator', async ({ page }) => {

        await page.goto('https://demoqa.com/buttons');

        await page.getByText('Click Me')
            .last()
            .click();

        await expect(
            page.getByText('You have done a dynamic click')
        ).toBeVisible();
    });
//The following test may not work as the label is not associated with the textbox using label for.

    test('getByLabel Locator', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');

        await page.getByLabel('Full Name')
            .fill('Bala');

        await expect(
            page.getByLabel('Full Name')
        ).toHaveValue('Bala');
    });

    //this is the alternative method to get the textbox using placeholder as label is not associated with the textbox.
    
    test('getByPlaceholder', async ({ page }) => {

    await page.goto('https://demoqa.com/text-box');

    await page.getByPlaceholder('Full Name')
        .fill('Bala');

    await expect(
        page.getByPlaceholder('Full Name')
    ).toHaveValue('Bala');
});
    test('URL Validation', async ({ page }) => {

        await page.goto('https://demoqa.com/text-box');

        await expect(page)
            .toHaveURL('https://demoqa.com/text-box');
    });

    test('Page Title Validation', async ({ page }) => {

        await page.goto('https://demoqa.com');

        await expect(page)
            .toHaveTitle(/demoqa/i);
    });

});