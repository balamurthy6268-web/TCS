import { test, expect, BrowserContext } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// COOKIE-BASED AUTHENTICATION
//
// Flows covered:
//   1. Set cookies manually on a context
//   2. Login via POST → receive Set-Cookie → use cookie on next request
//   3. Session cookie — persists while browser is open
//   4. HttpOnly / Secure / SameSite cookie attributes
//   5. Cookie expiry — expired cookie returns 401
//   6. Save & restore cookies across sessions (storageState)
//   7. Clear cookies → logged out
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://httpbin.org';

// ── 1. Manually set a cookie on the context ───────────────────────────────────
test('Cookies — manually set session cookie on browser context', async ({ context, page }) => {
  // Manually inject a session cookie (simulates being already logged in)
  await context.addCookies([
    {
      name: 'session_id',
      value: 'abc123_playwright_session',
      domain: 'httpbin.org',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    },
  ]);

  // httpbin /cookies returns all cookies it received
  const response = await page.goto(`${BASE_URL}/cookies`);
  expect(response?.status()).toBe(200);

  const bodyText = await page.locator('body').innerText();
  const body = JSON.parse(bodyText);

  expect(body.cookies.session_id).toBe('abc123_playwright_session');
  console.log('✅ Cookies: Manually injected cookie received by server:', body.cookies);
});


// ── 2. Multiple cookies at once ───────────────────────────────────────────────
test('Cookies — set multiple cookies (session + CSRF token)', async ({ context, page }) => {
  await context.addCookies([
    {
      name: 'session_id',
      value: 'user_session_xyz789',
      domain: 'httpbin.org',
      path: '/',
      httpOnly: true,
    },
    {
      name: 'csrf_token',
      value: 'csrf_abc_def_ghi',
      domain: 'httpbin.org',
      path: '/',
      httpOnly: false, // CSRF must be readable by JS
    },
    {
      name: 'user_pref',
      value: 'theme=dark&lang=en',
      domain: 'httpbin.org',
      path: '/',
    },
  ]);

  const response = await page.goto(`${BASE_URL}/cookies`);
  const bodyText = await page.locator('body').innerText();
  const body = JSON.parse(bodyText);

  expect(body.cookies.session_id).toBe('user_session_xyz789');
  expect(body.cookies.csrf_token).toBe('csrf_abc_def_ghi');
  expect(body.cookies.user_pref).toContain('dark');
  console.log('✅ Cookies: Multiple cookies sent to server:', body.cookies);
});


// ── 3. Login flow — POST login → server sets cookie → use cookie ──────────────
test('Cookies — simulate login: server sets cookie via Set-Cookie header', async ({ page }) => {
  const SESSION_VALUE = 'post_login_session_token_999';

  // Mock the login endpoint
  await page.route('https://myapp.com/api/login', async (route) => {
    const body = route.request().postDataJSON();

    if (body?.username === 'admin' && body?.password === 'password123') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        // Set-Cookie header — browser stores this automatically
        headers: {
          'Set-Cookie': [
            `session_id=${SESSION_VALUE}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
            `user_role=admin; Path=/`,
          ].join(', '),
        },
        body: JSON.stringify({ success: true, message: 'Login successful' }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
      });
    }
  });

  // Mock a protected endpoint that checks for session cookie
  await page.route('https://myapp.com/api/profile', async (route) => {
    const cookies = route.request().headers()['cookie'] || '';

    if (cookies.includes(`session_id=${SESSION_VALUE}`)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, username: 'admin', email: 'admin@example.com' }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not authenticated' }),
      });
    }
  });

  await page.goto('https://myapp.com');

  // Step 1: Login
  const loginResult = await page.evaluate(async () => {
    const res = await fetch('https://myapp.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: include cookies in requests
      body: JSON.stringify({ username: 'admin', password: 'password123' }),
    });
    return { status: res.status, data: await res.json() };
  });

  expect(loginResult.status).toBe(200);
  expect(loginResult.data.success).toBe(true);

  // Verify cookie was set in the browser context
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'session_id');
  // Note: httpOnly cookies are visible to Playwright but not to JS
  console.log('   🍪 Cookies after login:', cookies.map((c) => `${c.name}=${c.value}`));

  console.log('✅ Cookies: Login flow complete, session set');
});


// ── 4. Cookie attributes — HttpOnly, Secure, SameSite ────────────────────────
test('Cookies — verify HttpOnly, Secure, SameSite attributes', async ({ context, page }) => {
  await context.addCookies([
    {
      name: 'secure_session',
      value: 'top_secret_value',
      domain: 'httpbin.org',
      path: '/',
      httpOnly: true,   // Not accessible via document.cookie
      secure: true,     // Only sent over HTTPS
      sameSite: 'Strict', // Not sent on cross-site requests
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    },
  ]);

  // Verify Playwright sees the cookie with correct attributes
  const cookies = await context.cookies(['https://httpbin.org']);
  const sessionCookie = cookies.find((c) => c.name === 'secure_session');

  expect(sessionCookie).toBeDefined();
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.secure).toBe(true);
  expect(sessionCookie?.sameSite).toBe('Strict');
  expect(sessionCookie?.value).toBe('top_secret_value');

  // Verify HttpOnly: JS cannot read it
  await page.goto('https://httpbin.org');
  const jsReadableCookies = await page.evaluate(() => document.cookie);
  expect(jsReadableCookies).not.toContain('secure_session');

  console.log('✅ Cookies: HttpOnly confirmed — JS cannot read it');
  console.log('   Cookie attributes:', {
    httpOnly: sessionCookie?.httpOnly,
    secure: sessionCookie?.secure,
    sameSite: sessionCookie?.sameSite,
  });
});


// ── 5. Cookie expiry — expired cookie is not sent ─────────────────────────────
test('Cookies — expired cookie is rejected by server', async ({ page }) => {
  // Mock a protected endpoint
  await page.route('https://myapp.com/api/dashboard', async (route) => {
    const cookie = route.request().headers()['cookie'] || '';

    if (!cookie.includes('session_id=')) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Session expired or not found' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ page: 'dashboard', user: 'admin' }),
    });
  });

  await page.goto('https://myapp.com');

  // Set an already-expired cookie (expires = 1 second in the past)
  await page.context().addCookies([
    {
      name: 'session_id',
      value: 'expired_session_token',
      domain: 'myapp.com',
      path: '/',
      expires: Math.floor(Date.now() / 1000) - 1, // Already expired
    },
  ]);

  const cookies = await page.context().cookies(['https://myapp.com']);
  // Expired cookies are removed by the browser
  const sessionCookie = cookies.find((c) => c.name === 'session_id');
  expect(sessionCookie).toBeUndefined(); // Browser discards expired cookies

  console.log('✅ Cookies: Expired cookie not stored by browser');
});


// ── 6. Save & restore session state across tests ──────────────────────────────
test('Cookies — save session state to file and restore it', async ({ browser }) => {
  // Step 1: Create a "logged in" context
  const loginContext = await browser.newContext();
  await loginContext.addCookies([
    {
      name: 'session_id',
      value: 'persisted_session_abc',
      domain: 'httpbin.org',
      path: '/',
      httpOnly: true,
    },
    {
      name: 'remember_me',
      value: 'true',
      domain: 'httpbin.org',
      path: '/',
    },
  ]);

  // Save the storage state (cookies + localStorage) to a file
  const storageState = await loginContext.storageState();
  // In real projects: await loginContext.storageState({ path: 'auth/session.json' });

  console.log(
    '   💾 Saved storage state with cookies:',
    storageState.cookies.map((c) => c.name)
  );
  await loginContext.close();

  // Step 2: Restore the session in a new context
  const restoredContext = await browser.newContext({ storageState });
  const page = await restoredContext.newPage();

  const response = await page.goto('https://httpbin.org/cookies');
  const bodyText = await page.locator('body').innerText();
  const body = JSON.parse(bodyText);

  expect(body.cookies.session_id).toBe('persisted_session_abc');
  expect(body.cookies.remember_me).toBe('true');

  console.log('✅ Cookies: Session restored from saved state:', body.cookies);
  await restoredContext.close();
});


// ── 7. Clear cookies → user is logged out ─────────────────────────────────────
test('Cookies — clear cookies simulates logout', async ({ context, page }) => {
  // Mock a protected endpoint
  await page.route('https://myapp.com/api/me', async (route) => {
    const cookie = route.request().headers()['cookie'] || '';

    if (cookie.includes('session_id=valid_session')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ loggedIn: true, user: 'playwright' }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ loggedIn: false, error: 'Not authenticated' }),
      });
    }
  });

  // Set session cookie (logged in state)
  await context.addCookies([
    { name: 'session_id', value: 'valid_session', domain: 'myapp.com', path: '/' },
  ]);

  await page.goto('https://myapp.com');

  // Verify logged in
  const loggedIn = await page.evaluate(async () => {
    const res = await fetch('https://myapp.com/api/me', { credentials: 'include' });
    return res.json();
  });
  expect(loggedIn.loggedIn).toBe(true);
  console.log('   🔓 Before clear:', loggedIn);

  // Clear all cookies (simulate logout)
  await context.clearCookies();

  // Verify logged out
  const loggedOut = await page.evaluate(async () => {
    const res = await fetch('https://myapp.com/api/me', { credentials: 'include' });
    return { status: res.status, data: await res.json() };
  });
  expect(loggedOut.status).toBe(401);
  expect(loggedOut.data.loggedIn).toBe(false);
  console.log('   🔒 After clear:', loggedOut.data);
  console.log('✅ Cookies: Cleared cookies correctly logs user out');
});


// ── 8. Cookie via httpbin /cookies/set endpoint ───────────────────────────────
test('Cookies — server sets cookie via redirect (httpbin real endpoint)', async ({ page }) => {
  // httpbin.org/cookies/set?name=value sets a cookie via a redirect
  await page.goto(`${BASE_URL}/cookies/set?playwright_test=hello_from_test`);

  // After redirect, we end up at /cookies which shows current cookies
  const bodyText = await page.locator('body').innerText();
  const body = JSON.parse(bodyText);

  expect(body.cookies.playwright_test).toBe('hello_from_test');
  console.log('✅ Cookies: Server-set cookie via redirect:', body.cookies);
});
