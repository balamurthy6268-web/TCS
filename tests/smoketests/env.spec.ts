import { test, expect } from '@playwright/test';
import {config} from '../Config/config';

test('has title', async ({ page }) => {
  await page.goto(process.env.DEV_URL);

  console.log(config.username);
  console.log(config.password);
  
  
  // Expect a title "to contain" a substring.
  //await expect(page).toHaveTitle(//);
});

