/*
First run it with npx playwright test --update-snapshots to save the baseline image. 
On future runs, if the page changes, the test fails and Playwright writes three files into
 test-results/: the expected (baseline), actual (current), and a diff image with changed pixels
 highlighted in pink/red. No extra libraries needed — 
 This is the simplest path if you're already using Playwright Test.
*/
import { test, expect } from '@playwright/test';

test('compare homepage to baseline', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // tolerance for minor rendering differences
  });
});