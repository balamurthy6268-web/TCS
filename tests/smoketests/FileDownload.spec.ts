import { test, expect } from '@playwright/test';

test('File Download', async ({ page }) => {

    await page.goto(
        'https://the-internet.herokuapp.com/download'
    );

    const downloadPromise =
        page.waitForEvent('download');

    await page.getByText('some-file.txt').click();

    const download =
        await downloadPromise;

    await download.saveAs(
        `downloads/${download.suggestedFilename()}`
    );

    console.log(download.suggestedFilename());
});