import { test, expect } from '@playwright/test';

test.describe('UI Controls Automation Examples', () => {

    test('Lists and Dropdowns', async ({ page }) => {

        await page.goto('https://demoqa.com/select-menu');

        // Standard dropdown
        await page.selectOption('#oldSelectMenu', 'Purple');
        
            await expect.soft(page).toHaveTitle('Wrong Title');
            
         await test.step('Verify dropdown selection to have 4 as value', async () => {
            console.log("is 4 there ");
            await expect(page.locator('#oldSelectMenu'))
            .toHaveValue('4');
         });

         await test.step('Verify the count of options in dropdown box', async () => {
        
        //check the number of items
           await expect(page.locator('#oldSelectMenu option'))
            .toHaveCount(11);
            console.log("11 options should be there");
         });
         await test.step('Verify selectbox has red', async() => {
            await expect(page.locator('#oldSelectMenu'))
            .toContainText('Red');
            console.log("Red should be present");
         });
        


        // Get all options
        const options = await page.locator('#oldSelectMenu option').allTextContents();

        console.log('Dropdown Options:', options);
    });

    test('Tooltips', async ({ page }) => {

        await page.goto('https://demoqa.com/tool-tips');

        await page.locator('#toolTipButton').hover();

        const tooltip =
            page.locator('.tooltip-inner');

        await expect(tooltip)
            .toHaveText('You hovered over the Button');
    });

    test('Alert Dialog', async ({ page }) => {

        await page.goto('https://demoqa.com/alerts');

        page.on('dialog', async dialog => {

            console.log(dialog.type());
            console.log(dialog.message());

            await dialog.accept();
        });

        await page.locator('#alertButton').click();
    });

    test('Confirm Dialog', async ({ page }) => {

        await page.goto('https://demoqa.com/alerts');

        page.on('dialog', async dialog => {

            console.log(dialog.message());

            await dialog.dismiss();
        });

        await page.locator('#confirmButton').click();

        await expect(page.locator('#confirmResult'))
            .toContainText('Cancel');
    });

    test('Date Picker', async ({ page }) => {

        await page.goto('https://demoqa.com/date-picker');

        await page.locator('#datePickerMonthYearInput').click();

        await page.locator('#datePickerMonthYearInput')
            .fill('06/15/2026');

        await page.keyboard.press('Enter');

        await expect(page.locator('#datePickerMonthYearInput'))
            .toHaveValue('06/15/2026');
    });

    test('Shadow Root Elements', async ({ page }) => {

        await page.goto('https://books-pwakit.appspot.com/');

        const searchBox =
            page.locator('book-app')
                .locator('#input');

        await searchBox.fill('Playwright');

        await expect(searchBox)
            .toHaveValue('Playwright');
    });

    test('Web Table', async ({ page }) => {

        await page.goto('https://demoqa.com/webtables');

        const rows =
            page.locator("xpath=//table/tbody/tr");

        const count = await rows.count();

        console.log(`Row Count: ${count}`);

        for (let i = 0; i < count; i++) {

            const rowText =
                await rows.nth(i).textContent();

            console.log(rowText);
        }

            });

});