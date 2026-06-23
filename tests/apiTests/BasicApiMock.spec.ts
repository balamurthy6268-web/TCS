import { test, expect } from '@playwright/test';

/*
npm init -y
npm install express
Create a file server.js 
node server.js
The server runs and when you run this test it will mock the response from the server and 
display the mocked data instead of the real data from the server.
*/
test('mock api response', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      })
    });
  });

  await page.goto('http://localhost:3000');

  await expect(page.locator('text=Alice')).toBeVisible();
});