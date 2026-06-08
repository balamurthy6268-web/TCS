import { test, expect } from '@playwright/test';

test('validate cart total', async ({ page }) => {
    await page.goto('file:///e:/blaptop/tcs/products.html');

    const qty = Number(
        await page.locator('#qty').textContent()
    );

    const unitPrice = Number(
        await page.locator('#unitPrice').textContent()
    );

    const displayedTotal = Number(
        await page.locator('#total').textContent()
    );

    const calculatedTotal = qty * unitPrice;

    console.log(`Quantity: ${qty}, Unit Price: ${unitPrice}, Displayed Total: ${displayedTotal}, Calculated Total: ${calculatedTotal}`);    
    
    expect(calculatedTotal).toBe(displayedTotal);
});
