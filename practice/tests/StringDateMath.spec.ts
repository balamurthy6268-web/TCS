import { test, expect } from '@playwright/test';

//Solution for String, Math, Date, Regex, Dynamic Locator and Data Validation exercises.


test.beforeEach(async ({ page }) => {
  await page.goto('file:///e:/blaptop/tcs/sdm.html');
});

//# 1. Username Validation


test('username validation', async ({ page }) => {
  const username =
    (await page.locator('#username').textContent())?.trim() ?? '';

  expect(username.length).toBeGreaterThan(5);
  expect(username.toUpperCase()).toBe('BALAMURTHY');
  expect(username.toLowerCase()).toBe('balamurthy');
  expect(username).toContain('Murthy');
  expect(username.startsWith('Bala')).toBeTruthy();
  expect(username.endsWith('thy')).toBeTruthy();
});

//# 2. Email Validation

test('email validation', async ({ page }) => {
  const email =
    (await page.locator('#email').textContent())?.trim() ?? '';

  const domain = email.split('@')[1];

  expect(domain).toBe('gmail.com');
  expect(email.lastIndexOf('.')).toBeGreaterThan(-1);
  expect(email.includes('@')).toBeTruthy();
  expect(email.length).toBeGreaterThan(10);
});

//# 3. Order Number

test('order validation', async ({ page }) => {
  const text =
    (await page.locator('#order').textContent())?.trim() ?? '';

  const order = text.split(':')[1].trim();

  const number = Number(order.replace('ORD-', ''));

  expect(number).toBeGreaterThan(10000);
  expect(order).toMatch(/^ORD-\d{5}$/);
});

//# 4. URL Validation

test('url validation', async ({ page }) => {
  const url =
    (await page.locator('#url').textContent())?.trim() ?? '';

  expect(url.startsWith('https')).toBeTruthy();
  expect(url).toContain('dashboard');

  const domain = url.split('/')[2];

  expect(domain).toBe('example.com');
});

//# 5. File Validation

test('file validation', async ({ page }) => {
  const file =
    (await page.locator('#file').textContent())?.trim() ?? '';

  const parts = file.split('.');

  expect(parts[1]).toBe('pdf');
  expect(parts[0]).toBe('report');
  expect(parts[0].toUpperCase()).toBe('REPORT');
});

//# 6. Product Price
test('price calculation', async ({ page }) => {
  const price =
    (await page.locator('#price').textContent())?.trim() ?? '';

  const value = Number(price.replace('$', ''));

  const gst = Math.round(value * 1.18);

  expect(gst).toBe(118);
});


//# 7. Shopping Cart

test('shopping cart', async ({ page }) => {
  const qty = Number(await page.locator('#qty').textContent());
  const unitPrice = Number(await page.locator('#unitPrice').textContent());

  const total = qty * unitPrice;

  const finalAmount = Math.round(total * 1.18);

  expect(finalAmount).toBe(885);
});

//# 8. Rating Validation

test('rating validation', async ({ page }) => {
  const rating = Number(await page.locator('#rating').textContent());

  expect(Math.floor(rating)).toBe(4);
  expect(Math.ceil(rating)).toBe(5);
  expect(Math.round(rating)).toBe(5);
});

//# 9. OTP Generation

test('otp generation', async () => {
  for (let i = 0; i < 100; i++) {
    const otp =
      Math.floor(Math.random() * 9000) + 1000;

    expect(otp).toBeGreaterThanOrEqual(1000);
    expect(otp).toBeLessThanOrEqual(9999);
  }
});

//# 10. Discount Calculation

test('discount calculation', async () => {
  const price = 5000;
  const discount = 12;

  const finalAmount =
    price - (price * discount / 100);

  expect(finalAmount).toBe(4400);
});

//# 11. Current Date

test('current date', async () => {
  const today = new Date();

  console.log(today.getDate());
  console.log(today.getMonth() + 1);
  console.log(today.getFullYear());

  expect(today.getFullYear()).toBeGreaterThan(2025);
});

//# 12. Login Timestamp

test('timestamp', async () => {
  const now = new Date();

  const timestamp =
    `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

  console.log(timestamp);

  expect(timestamp.length).toBeGreaterThan(5);
});

//# 13. Future Date

test('future dates', async () => {
  const today = new Date();

  const plus7 = new Date(today);
  plus7.setDate(today.getDate() + 7);

  const plus30 = new Date(today);
  plus30.setDate(today.getDate() + 30);

  expect(plus30.getTime())
    .toBeGreaterThan(plus7.getTime());
});

//# 14. Expiry Validation

test('expiry validation', async ({ page }) => {
  const expiry =
    (await page.locator('#expiry').textContent())?.trim() ?? '';

  const expiryDate = new Date(expiry);

  expect(expiryDate.getTime())
    .toBeGreaterThan(Date.now());
});

//# 15. Age Calculation

test('age calculation', async ({ page }) => {
  const dob =
    (await page.locator('#dob').textContent())?.trim() ?? '';

  const birthYear =
    new Date(dob).getFullYear();

  const age =
    new Date().getFullYear() - birthYear;

  expect(age).toBeGreaterThanOrEqual(18);
});

//# 16. Booking Duration

test('booking duration', async ({ page }) => {
  const checkIn =
    new Date((await page.locator('#checkin').textContent())?.trim() ?? '');

  const checkOut =
    new Date((await page.locator('#checkout').textContent())?.trim() ?? '');

  const days =
    (checkOut.getTime() - checkIn.getTime())
    / (1000 * 60 * 60 * 24);

  expect(days).toBe(5);
});

//# 17. Invoice Validation

test('invoice validation', async ({ page }) => {
  const invoice =
    (await page.locator('#invoice').textContent())?.trim() ?? '';

  const parts = invoice.split('-');

  const year = parts[1];
  const number = parts[2];

  expect(year).toBe('2026');
  expect(Number(number)).toBeGreaterThan(10000);
});

//# 18. Username Generator

test('username generator', async ({ page }) => {
  const first =
    (await page.locator('#firstname').textContent())?.trim() ?? '';

  const last =
    (await page.locator('#lastname').textContent())?.trim() ?? '';

  const username =
    `${first.toLowerCase()}.${last.toLowerCase()}`;

  expect(username).toBe('bala.murthy');
});

//# 19. Report Name Generator

test('report name generator', async () => {
  const today = new Date();

  const reportName =
    `Report_${today.getFullYear()}${
      String(today.getMonth() + 1).padStart(2, '0')
    }${
      String(today.getDate()).padStart(2, '0')
    }.pdf`;

  console.log(reportName);

  expect(reportName.endsWith('.pdf')).toBeTruthy();
});

//# 20. Dynamic Locator Builder

test('dynamic locator', async ({ page }) => {
  const city = 'Chennai';

  const xpath =
    `//div[text()='${city}']`;

  await expect(
    page.locator(xpath)
  ).toBeVisible();
});
