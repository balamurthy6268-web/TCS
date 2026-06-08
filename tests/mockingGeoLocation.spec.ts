import { test, expect } from '@playwright/test';
import { acceptCookies } from './utils/acceptCookies';

const cities = [
  { city: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  { city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
  { city: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
];

for (const cityData of cities) {
  test(`Store locator shows stores for ${cityData.city}`, async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: {
        latitude: cityData.latitude,
        longitude: cityData.longitude,
      },
      permissions: ['geolocation'],
      bypassCSP: true, // Bypass Content Security Policy/Disable browser cache 
    });
// 🔴 Disable cache so map doesn't reuse old location
 await context.route('**/*', async (route) => {

      const headers = {
        ...route.request().headers(),
        'Cache-Control': 'no-cache'
      };

      await route.continue({ headers });
    });
   
    
    await context.addCookies([
  {
    name: 'OptanonAlertBoxClosed',
    value: 'true',
    domain: '.starbucks.in',
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: true,
    sameSite: 'Lax',
  },
  {
    name: 'OptanonConsent',
    value: 'isIABGlobal=false&datestamp=true',
    domain: '.starbucks.in',
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: true,
    sameSite: 'Lax',
  },
]);

    const page = await context.newPage();

    // Navigate
    await page.goto(
      'https://www.starbucks.in/store-locator',
      {
        waitUntil: 'networkidle'
      }
    );
      // ✅ Accept cookie banner
    await acceptCookies(page);

    // 🔹 Adjust locator based on actual DOM

   // const storeCards = page.locator('.store-card, .store-list-item');
    //This works. disabled for trace viewer.
    const storeCards = page.locator('.card');
    console.log(
       "Locator count: " + (await storeCards.count())
    );

    // Wait for stores to load
    await expect(storeCards.first()).toBeVisible({ timeout: 15000 });
 //   page.getByRole('button', { name: 'Show Directions' }).first().click();
    // Verify that at least one store is shown
   expect(await storeCards.count()).toBeGreaterThan(0);
    

    await context.close();
  });
}
