
import { test, expect, Page } from '@playwright/test';

test.describe('Monitor Stock Price', () => {

  enum COMPANYNAME { company1 = "RSD Finance" };
  const company :COMPANYNAME = COMPANYNAME.company1;
  test('should display the correct stock price for `${company}`', async ({ page }) => {
    // Navigate to the stock monitoring page
    await page.goto('https://money.rediff.com/gainers/bse/daily/groupall');

    // Locate the stock price for Primo Chemicals using XPath

    const xpath = `//a[contains(text(),'${company}')]/parent::td/following-sibling::td[3]`;

    const stockPriceLocator = page.locator(xpath);
    console.log(xpath);

    //scroll into view stockPriceLocator
    await stockPriceLocator.scrollIntoViewIfNeeded();
    await stockPriceLocator.waitFor();  
    const stockPriceText = await stockPriceLocator.textContent();
    const stockPrice = parseFloat((stockPriceText || '').trim());
    //  const stockPrice = 56.124562522;
    // Assert that the stock price is displayed and is a valid number
    expect(Number.isFinite(stockPrice)).toBe(true);

    console.log(`Current stock price: ${stockPrice}`);
    expect(stockPrice).toBeGreaterThan(20);
  });

});