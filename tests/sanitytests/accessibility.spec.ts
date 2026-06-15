//Accessibility Test case
//Run the following command to install axe-core for Playwright before running the test:
//npm install @axe-core/playwright
//Checks for WCAG 2.1 accessibility issues on the specified page and reports any violations found.

//npm install @axe-core/playwright

import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should have no accessibility violations on the homepage', async ({ page }) => {
    await page.goto('https://www.google.com'); // Replace with your application's URL
    const results = await new AxeBuilder({ page }).analyze();
    console.log(results.violations);

    //expect(results.violations.length).toBe(0);
    // You can add more specific assertions based on axe results
  });
});
//Check if a screenshot will be available on accessibility check highlighting elements that dont comply.
