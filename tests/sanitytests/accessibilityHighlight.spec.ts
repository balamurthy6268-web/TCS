import AxeBuilder from '@axe-core/playwright';
import { test } from '@playwright/test';

test('Accessibility Scan', async ({ page }) => {

    await page.goto('https://www.google.com');

    const results = await new AxeBuilder({ page })
        .analyze();

    for (const violation of results.violations) {

        for (const node of violation.nodes) {

            for (const target of node.target) {

                const selector = Array.isArray(target)
                    ? target.join(' ')
                    : String(target);

                await page.locator(selector)
                    .evaluate(el => {
                        (el as HTMLElement).style.border =
                            '3px solid red';
                    });
            }
        }
    }

    await page.screenshot({
        path: 'axe-violations.png',
        fullPage: true
    });
});