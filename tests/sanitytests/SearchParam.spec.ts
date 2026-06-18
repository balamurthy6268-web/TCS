import { test, expect } from '@playwright/test';
import * as fs from 'fs';
[
  { keyword: 'Mouse', expected: '10 ITEMS' },
  { keyword: 'abcdxyz', expected: 'No Results found' },
].forEach(({ keyword, expected }) => {

   test(`SearchTest - ${keyword}`, async ({ page }) => {
    await page.goto('https://advantageonlineshopping.com/#/');
    await page.getByTitle('SEARCH').click();
    await page.getByRole('textbox', { name: 'Search' }).fill(keyword);
    await page.getByRole('textbox', { name: 'Search' }).press('Enter');

    const noResultsText = page.getByText('No results for');
    const resultsLocator = page.locator('xpath=//a[contains(@class,"titleItemsCount")]');

    // Wait for either the no-results message or the results locator to appear (timeout 10s)
    try {
        await Promise.race([
            noResultsText.waitFor({ state: 'visible', timeout: 10000 }),
            resultsLocator.waitFor({ state: 'visible', timeout: 10000 })
        ]);
    } catch (err) {
        console.log('Neither results nor "No results" appeared within timeout');
        await page.close();
        throw err;
    }

    // Branch based on which locator is visible
    if (await noResultsText.isVisible()) {
        console.log('No items found');
         fs.appendFileSync(
                'Searchlog.txt',
                `Keyword: ${keyword}-No items found`
            );
    } else if (await resultsLocator.isVisible()) {
        const resultsText = (await resultsLocator.textContent() || '').trim();
        console.log('Search has items!' + resultsText);
        if  (resultsText === expected){

             console.log('Search count matched expected value: ' + expected);
        }
        else {
            test.fail();
            console.log('Search count did not match expected value. Expected: ' + expected + ', Actual: ' + resultsText);    
            //Write the log into a text file
            
             fs.appendFileSync(
                'Searchlog.txt',
                `${getFormattedDateTime()} | Keyword: ${keyword} Exp:${expected}  | Actual: ${resultsText}\n` 
            );
  
        }


        }
    else {
        console.log('Unexpected state: neither locator is visible');
    }

   await page.close();
});

});

function getFormattedDateTime(): string {
    const now = new Date();

    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}
