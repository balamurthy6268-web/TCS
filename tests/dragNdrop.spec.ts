import { test,expect } from '@playwright/test';

test('drag and drop', async ({ page }) => {
  await page.goto('https://www.globalsqa.com/demo-site/draganddrop/');

  // use frameLocator or await contentFrame()
  // const frame = page.frameLocator('iframe.demo-frame');
  const frame =  page.locator('iframe.demo-frame').first().contentFrame();
  if (!frame) throw new Error('demo iframe not found');
  const source = frame.locator('#gallery li').first();
  const target = frame.locator('#trash');

  await source.waitFor();
  await target.waitFor();

  try {
  await source.dragTo(target);
  await expect(target.locator('li')).toHaveCount(1);
  console.log('Drag and drop successful');
    } catch (error) {

    console.error('Drag and drop failed:', error);  
    throw error; // re-throw the error to fail the test
    await page.screenshot({ path: 'drag-and-drop-error.png' });
}
});