import { test, expect, request } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// BASIC AUTHENTICATION
// Uses: https://httpbin.org  (free public HTTP testing service)
//
// Basic Auth sends credentials as Base64 encoded "username:password"
// in the Authorization header:
//   Authorization: Basic dXNlcjpwYXNzd29yZA==
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://httpbin.org';
const USERNAME = 'playwright';
const PASSWORD = 'secret123';

// ── 1. Manual Basic Auth Header ───────────────────────────────────────────────
test('Basic Auth — manually build Authorization header', async ({ request }) => {
  // Encode "username:password" to Base64
  const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

  const response = await request.get(`${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.authenticated).toBe(true);
  expect(body.user).toBe(USERNAME);

  console.log('✅ Basic Auth (manual header):', body);
});


// ── 2. Basic Auth via Playwright httpCredentials option ───────────────────────
test('Basic Auth — using Playwright httpCredentials', async ({ playwright }) => {
  // Playwright has built-in support for Basic Auth via httpCredentials
  const context = await playwright.request.newContext({
    httpCredentials: {
      username: USERNAME,
      password: PASSWORD,
    },
  });

  const response = await context.get(`${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.authenticated).toBe(true);

  console.log('✅ Basic Auth (httpCredentials):', body);
  await context.dispose();
});


// ── 3. Basic Auth — Wrong credentials → 401 ───────────────────────────────────
test('Basic Auth — wrong password returns 401', async ({ request }) => {
  const wrongCredentials = Buffer.from(`${USERNAME}:wrongpassword`).toString('base64');

  const response = await request.get(`${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`, {
    headers: {
      Authorization: `Basic ${wrongCredentials}`,
    },
  });

  expect(response.status()).toBe(401);
  console.log('✅ Basic Auth: 401 returned for wrong credentials');
});


// ── 4. Basic Auth — No credentials → 401 ─────────────────────────────────────
test('Basic Auth — missing Authorization header returns 401', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`);

  expect(response.status()).toBe(401);
  console.log('✅ Basic Auth: 401 returned for missing Authorization header');
});


// ── 5. Basic Auth — Verify headers sent to server ────────────────────────────
test('Basic Auth — verify correct Authorization header is sent', async ({ request }) => {
  const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

  // /headers endpoint echoes back all request headers
  const response = await request.get(`${BASE_URL}/headers`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  const authHeader = body.headers['Authorization'];

  expect(authHeader).toBe(`Basic ${credentials}`);
  console.log('✅ Basic Auth: Header verified on server side:', authHeader);
});


// ── 6. Basic Auth — Intercept & inject credentials via page.route ─────────────
test('Basic Auth — inject credentials via route interception', async ({ page }) => {
  const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

  // Intercept all requests and inject the Authorization header automatically
  await page.route(`${BASE_URL}/**`, async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        Authorization: `Basic ${credentials}`,
      },
    });
  });

  const response = await page.goto(
    `${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`
  );

  expect(response?.status()).toBe(200);
  console.log('✅ Basic Auth: Credentials injected via route interception');
});


// ── 7. Basic Auth — Reusable helper function ─────────────────────────────────
function buildBasicAuthHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

test('Basic Auth — reusable helper function', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/basic-auth/${USERNAME}/${PASSWORD}`, {
    headers: {
      Authorization: buildBasicAuthHeader(USERNAME, PASSWORD),
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.authenticated).toBe(true);
  console.log('✅ Basic Auth: Reusable helper works:', body);
});
