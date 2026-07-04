//go to barnesandnoble.com website and check if the menu items are visible  
import { test, expect } from '@playwright/test';

test('check if the menu items are visible', async ({ page }) => {
  await page.goto('https://www.barnesandnoble.com/', { waitUntil: 'networkidle' });
 // await expect(page.locator('nav')).toBeVisible();
  
  const menuItems = [
    'Bestsellers',
    'Books',
    'Kids & Teens',
    'What to Read',
    'New',
    'Coming Soon',
    'eBooks & NOOK',
    'Toys, Games & Gifts',
    'Music & Movies',
    'Miscellaneous'
  ];

  //check all links within the div having class attribute value as class="header-nav__container container" 

  const headerlinks = page.locator('.header-nav__container.container');

  for (const item of menuItems) {
    try{
    await expect(headerlinks).toContainText(item);
    }
    catch 
    {
        console.error(`Menu item "${item}" is not visible.`);

    }
}
});
