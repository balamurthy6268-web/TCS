// npm install pixelmatch pngjs --save-dev
import { PNG } from 'pngjs';

import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { Page,test,expect } from '@playwright/test';

test('Pixel match homepage to baseline', async ({ page }) => {

await page.goto('https://opensource-demo.orangehrmlive.com/');
await compareScreenshots(page, 'baseline.png', 'diff.png');
});

async function compareScreenshots(page: Page, baselinePath: string, diffOutputPath: string) {
  const currentBuffer = await page.screenshot();
  const current = PNG.sync.read(currentBuffer);
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));

  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(baseline.data, current.data, diff.data, width, height, {
    threshold: 0.1,       // 0 = strict, 1 = very tolerant
    diffColor: [255, 0, 0], // changed pixels highlighted in red
  });

  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));
  console.log(`Changed pixels: ${numDiffPixels}`);
  return numDiffPixels;
}



