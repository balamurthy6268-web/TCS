import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('Price Slider Validation', () => {
    test('Validate all items have price <= max PRICE slider value', async ({ page }) => {
        // Navigate to Speakers category
        await page.goto('https://advantageonlineshopping.com/#/category/Speakers/4');
        console.log('Navigated to Speakers category');

        // Expand PRICE filter
        await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            for (let el of allElements) {
                if (el.textContent.includes('PRICE') && el.textContent.length < 100) {
                    const parent = el.closest('li') || el.closest('div[class*="filter"]');
                    if (parent) {
                        const dropdown = parent.querySelector<HTMLElement>('[class*="expand"], [class*="toggle"], [class*="arrow"]');
                        if (dropdown) {
                            dropdown.click();
                            break;
                        }
                    }
                }
            }
        });

        await page.waitForTimeout(500);

        // Get the price range slider (it's a range input)
        const maxPriceSlider = page.locator('input[type="range"]').nth(1); // Second range input is for max
        const minPriceSlider = page.locator('input[type="range"]').nth(0); // First is for min

        // Set max price to $150
        const maxPrice = 150;
        await maxPriceSlider.fill(maxPrice.toString());
        console.log(`Set max price slider to $${maxPrice}`);

        // Wait for items to load after slider adjustment
        await page.waitForTimeout(1500);

        // Get all item prices - they appear as text in paragraphs with price info
        const priceElements = page.locator('paragraph >> text=$');
        const allText = (await page.locator('body').textContent()) ?? '';

        // Extract prices using regex from visible items
        const priceRegex = /\$(\d+\.\d{2})/g;
        const priceMatches = allText.match(priceRegex) || [];
        const prices = priceMatches.map(p => parseFloat(p.replace('$', '')));

        if (prices.length === 0) {
            throw new Error('Could not extract any prices from the page');
        }

        console.log(`Found ${prices.length} prices on the page`);
        console.log(`Prices: ${prices.join(', ')}`);

        // Validate that all visible prices are <= max price slider value
        const invalidPrices: { price: number; index: number }[] = [];

        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];
            console.log(`Item ${i + 1}: $${price.toFixed(2)}`);

            if (price > maxPrice) {
                invalidPrices.push({ price, index: i });
                console.error(`❌ Item ${i + 1} exceeds max price: $${price.toFixed(2)} > $${maxPrice}`);
            }
        }

        // Log results
        const logEntry = `${getFormattedDateTime()} | Max Price Set: $${maxPrice} | Total Items: ${prices.length} | Invalid Items: ${invalidPrices.length}\n`;

        if (invalidPrices.length > 0) {
            const invalidDetails = invalidPrices
                .map(item => `Item ${item.index + 1}: $${item.price.toFixed(2)}`)
                .join(', ');

            fs.appendFileSync('PriceSliderValidation.log.txt', logEntry + `Invalid Items: ${invalidDetails}\n\n`);
            console.log(`\n⚠️ Test FAILED: ${invalidPrices.length} items exceed max price of $${maxPrice}`);
            expect(invalidPrices.length).toBe(0);
        } else {
            fs.appendFileSync('PriceSliderValidation.log.txt', logEntry + 'All items passed validation ✓\n\n');
            console.log(`\n✓ Test PASSED: All ${prices.length} items are within max price of $${maxPrice}`);
        }
    });

    test('Validate price slider changes filter results correctly', async ({ page }) => {
        await page.goto('https://advantageonlineshopping.com/#/category/Speakers/4');
        console.log('Navigated to Speakers category');

        // Expand PRICE filter
        await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            for (let el of allElements) {
                if (el.textContent.includes('PRICE') && el.textContent.length < 100) {
                    const parent = el.closest('li') || el.closest('div[class*="filter"]');
                    if (parent) {
                        const dropdown = parent.querySelector<HTMLElement>('[class*="expand"], [class*="toggle"], [class*="arrow"]');
                        if (dropdown) {
                            dropdown.click();
                            break;
                        }
                    }
                }
            }
        });

        await page.waitForTimeout(500);

        const maxPriceSlider = page.locator('input[type="range"]').nth(1);

        // Test at $100 max
        let maxPrice = 100;
        await maxPriceSlider.fill(maxPrice.toString());
        await page.waitForTimeout(1000);

        let bodyText = await page.locator('body').textContent() || '';
        let priceMatches = bodyText.match(/\$(\d+\.\d{2})/g) || [];
        let count100 = priceMatches.length;
        console.log(`Items at $${maxPrice}: ${count100}`);

        // Test at $200 max
        maxPrice = 200;
        await maxPriceSlider.fill(maxPrice.toString());
        await page.waitForTimeout(1000);

        bodyText = await page.locator('body').textContent() || '';
        priceMatches = bodyText.match(/\$(\d+\.\d{2})/g) || [];
        let count200 = priceMatches.length;
        console.log(`Items at $${maxPrice}: ${count200}`);

        // Higher price limit should show more or equal items
        expect(count200).toBeGreaterThanOrEqual(count100);

        fs.appendFileSync(
            'PriceSliderValidation.log.txt',
            `${getFormattedDateTime()} | Slider adjustment test | $100: ${count100} items | $200: ${count200} items\n\n`
        );

        console.log('✓ Price Slider adjustment test passed');
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
