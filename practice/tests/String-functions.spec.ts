import { test, Page, expect, Browser } from '@playwright/test';


let page: Page;
test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    await page.goto('file:///e:/blaptop/tcs/strings.html');

});
test.afterAll(async () => {
    await page.close();
});


test('length', async () => {
    const username =
        (await page.locator('#username').textContent())?.trim() ?? '';

    expect(username.length).toBeGreaterThan(5);
});

test('toUpperCase', async () => {
    const username =
        (await page.locator('#username').textContent())?.trim() ?? '';

    expect(username.toUpperCase()).toBe('BALAMURTHY');
});

test('toLowerCase', async () => {
    const username =
        (await page.locator('#username').textContent())?.trim() ?? '';

    expect(username.toLowerCase()).toBe('balamurthy');
});

test('includes', async () => {
    const url =
        (await page.locator('#url').textContent())?.trim() ?? '';

    expect(url).toContain('dashboard');
});

test('startsWith', async () => {
    const orderText =
        (await page.locator('#order').textContent())?.trim() ?? '';

    const orderNumber =
        orderText.split(':')[1].trim();

    expect(orderNumber.startsWith('ORD')).toBeTruthy();
});

test('endsWith', async () => {
    const fileName =
        (await page.locator('#filename').textContent())?.trim() ?? '';

    expect(fileName.endsWith('.pdf')).toBeTruthy();
});

test('trim', async () => {
    const heading =
        await page.locator('#heading').textContent();

    expect(heading?.trim())
        .toBe('Welcome To Playwright');
});

test('replace', async () => {
    const price =
        (await page.locator('#price').textContent())?.trim() ?? '';

    const numericPrice = price.replace('$', '');

    expect(numericPrice).toBe('100');
});

test('replaceAll', async () => {
    const date =
        (await page.locator('#date').textContent())?.trim() ?? '';

    const newDate = date.replaceAll('/', '-');

    expect(newDate).toBe('01-06-2026');
});

test('split', async () => {
    const orderText =
        (await page.locator('#order').textContent())?.trim() ?? '';

    const orderId =
        orderText.split(':')[1].trim();

    expect(orderId).toBe('ORD-12345');
});

test('substring', async () => {
    const ticket =
        (await page.locator('#ticket').textContent())?.trim() ?? '';

    const ticketNumber =
        ticket.substring(3);

    expect(ticketNumber).toBe('123456');
});

test('slice', async () => {
    const status =
        (await page.locator('#status').textContent())?.trim() ?? '';

    expect(status.slice(0, 4))
        .toBe('Comp');
});

test('charAt', async () => {
    const code =
        (await page.locator('#code').textContent())?.trim() ?? '';

    expect(code.charAt(0)).toBe('A');
});

test('indexOf', async () => {
    const message =
        (await page.locator('#message').textContent())?.trim() ?? '';

    expect(message.indexOf('Successful'))
        .toBeGreaterThan(-1);
});

test('lastIndexOf', async () => {
    const email =
        (await page.locator('#email').textContent())?.trim() ?? '';

    const lastDot =
        email.lastIndexOf('.');

    expect(lastDot).toBeGreaterThan(-1);
});

test('concat', async () => {
    const firstName = 'Bala';
    const lastName = 'Murthy';

    const fullName =
        firstName.concat(' ', lastName);

    expect(fullName).toBe('Bala Murthy');
});

test('match regex', async () => {
    const orderText =
        (await page.locator('#order').textContent())?.trim() ?? '';

    const orderNumber =
        orderText.split(':')[1].trim();

    expect(orderNumber)
        .toMatch(/^ORD-\d{5}$/);
});

test('search', async () => {
    const message =
        (await page.locator('#message').textContent())?.trim() ?? '';

    expect(message.search('Payment'))
        .toBeGreaterThan(-1);
});

test('repeat', async () => {
    const separator = '-'.repeat(20);

    expect(separator)
        .toBe('--------------------');
});

test('template literal', async () => {
    const username =
        (await page.locator('#username').textContent())?.trim() ?? '';

    const dynamicXpath =
        `//div[text()='${username}']`;

    const userLocator =
        page.locator(dynamicXpath);

    await expect(userLocator).toBeVisible();
});