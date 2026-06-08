import { test, expect, request, APIRequestContext } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// OAUTH2 AUTHENTICATION
//
// OAuth2 flows covered:
//   1. Client Credentials  — machine-to-machine (most common in API testing)
//   2. Bearer Token        — using a token you already have
//   3. Token Refresh       — refreshing an expired access token
//   4. Mocked OAuth2 flow  — intercept token endpoint (no real OAuth server needed)
//
// Real endpoint: https://httpbin.org  (for Bearer token verification)
// Token endpoint mock: intercepted via page.route()
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Simulates fetching a token from a real OAuth2 token endpoint
async function fetchOAuth2Token(
  apiContext: APIRequestContext,
  tokenUrl: string,
  clientId: string,
  clientSecret: string,
  scope?: string
): Promise<TokenResponse> {
  const response = await apiContext.post(tokenUrl, {
    form: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      ...(scope && { scope }),
    },
  });

  if (!response.ok()) {
    throw new Error(`Token request failed: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}

// Refreshes an expired access token using a refresh token
async function refreshAccessToken(
  apiContext: APIRequestContext,
  tokenUrl: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<TokenResponse> {
  const response = await apiContext.post(tokenUrl, {
    form: {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    },
  });

  return response.json();
}


// ── 1. Bearer Token — send existing token in Authorization header ─────────────
test('OAuth2 — Bearer token sent in Authorization header', async ({ request }) => {
  // Simulate a token you received from your OAuth2 server
  const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock_token';

  // httpbin /bearer endpoint validates that Bearer token is present
  const response = await request.get('https://httpbin.org/bearer', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.authenticated).toBe(true);
  expect(body.token).toBe(accessToken);

  console.log('✅ OAuth2 Bearer: Token accepted:', body);
});


// ── 2. OAuth2 — Missing token → 401 ──────────────────────────────────────────
test('OAuth2 — missing Bearer token returns 401', async ({ request }) => {
  const response = await request.get('https://httpbin.org/bearer');

  expect(response.status()).toBe(401);
  console.log('✅ OAuth2: 401 returned when token is missing');
});


// ── 3. OAuth2 Client Credentials — full mocked flow ──────────────────────────
test('OAuth2 — Client Credentials flow (mocked token endpoint)', async ({ page }) => {
  const MOCK_TOKEN = 'mock_access_token_abc123xyz';
  const TOKEN_URL = 'https://auth.example.com/oauth/token';
  const API_URL = 'https://api.example.com/data';

  // Step 1: Mock the OAuth2 token endpoint
  await page.route(TOKEN_URL, async (route) => {
    const body = route.request().postData() || '';

    // Validate it's a client_credentials grant
    expect(body).toContain('grant_type=client_credentials');
    expect(body).toContain('client_id=my-client-id');

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: MOCK_TOKEN,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read write',
      } as TokenResponse),
    });
  });

  // Step 2: Mock the protected API endpoint
  await page.route(API_URL, async (route) => {
    const authHeader = route.request().headers()['authorization'];

    if (authHeader !== `Bearer ${MOCK_TOKEN}`) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_token' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'protected resource', userId: 42 }),
    });
  });

  await page.goto('https://example.com');

  // Step 3: Simulate client fetching token then calling API
  const result = await page.evaluate(async ({ tokenUrl, apiUrl }: { tokenUrl: string; apiUrl: string }) => {
    // Fetch token
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'my-client-id',
        client_secret: 'my-client-secret',
      }).toString(),
    });
    const { access_token } = await tokenRes.json();

    // Use token to call protected API
    const apiRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return apiRes.json();
  }, { tokenUrl: TOKEN_URL, apiUrl: API_URL });

  expect(result.data).toBe('protected resource');
  expect(result.userId).toBe(42);
  console.log('✅ OAuth2 Client Credentials: Full flow worked:', result);
});


// ── 4. OAuth2 — Token Refresh flow (mocked) ───────────────────────────────────
test('OAuth2 — Token Refresh flow when access token expires', async ({ page }) => {
  const EXPIRED_TOKEN = 'expired_token_111';
  const REFRESH_TOKEN = 'refresh_token_abc';
  const NEW_ACCESS_TOKEN = 'new_access_token_999';
  const TOKEN_URL = 'https://auth.example.com/oauth/token';
  const API_URL = 'https://api.example.com/profile';

  // Mock the token endpoint — handles both initial + refresh grants
  await page.route(TOKEN_URL, async (route) => {
    const body = route.request().postData() || '';

    if (body.includes('grant_type=refresh_token')) {
      // Refresh token grant
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: NEW_ACCESS_TOKEN,
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'new_refresh_token_xyz',
        }),
      });
    } else {
      await route.fulfill({ status: 400, body: JSON.stringify({ error: 'unsupported_grant_type' }) });
    }
  });

  // Mock the API — returns 401 for expired token, 200 for new token
  await page.route(API_URL, async (route) => {
    const authHeader = route.request().headers()['authorization'];

    if (authHeader === `Bearer ${EXPIRED_TOKEN}`) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'token_expired', message: 'Access token has expired' }),
      });
    } else if (authHeader === `Bearer ${NEW_ACCESS_TOKEN}`) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, name: 'John Doe', email: 'john@example.com' }),
      });
    } else {
      await route.fulfill({ status: 401, body: JSON.stringify({ error: 'invalid_token' }) });
    }
  });

  await page.goto('https://example.com');

  const result = await page.evaluate(async ({
    tokenUrl, apiUrl, expiredToken, refreshToken
  }: {
    tokenUrl: string; apiUrl: string; expiredToken: string; refreshToken: string
  }) => {
    // Step 1: Try with expired token — should get 401
    let apiRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });

    let data: any = {};

    if (apiRes.status === 401) {
      // Step 2: Refresh the token
      const refreshRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: 'my-client-id',
          client_secret: 'my-client-secret',
        }).toString(),
      });
      const { access_token: newToken } = await refreshRes.json();

      // Step 3: Retry with new token
      apiRes = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      data = await apiRes.json();
    }

    return { finalStatus: apiRes.status, profile: data };
  }, { tokenUrl: TOKEN_URL, apiUrl: API_URL, expiredToken: EXPIRED_TOKEN, refreshToken: REFRESH_TOKEN });

  expect(result.finalStatus).toBe(200);
  expect(result.profile.name).toBe('John Doe');
  console.log('✅ OAuth2 Refresh: Token refreshed and retry succeeded:', result);
});


// ── 5. OAuth2 — Intercept and inject token automatically on all requests ───────
test('OAuth2 — auto-inject Bearer token on every API request via route', async ({ page }) => {
  const ACCESS_TOKEN = 'auto_injected_token_456';

  // Intercept ALL requests to the API domain and inject the token
  await page.route('https://httpbin.org/**', async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
  });

  // httpbin /bearer checks the Authorization header
  const response = await page.goto('https://httpbin.org/bearer');
  expect(response?.status()).toBe(200);

  const bodyText = await page.locator('body').innerText();
  const body = JSON.parse(bodyText);
  expect(body.authenticated).toBe(true);
  expect(body.token).toBe(ACCESS_TOKEN);

  console.log('✅ OAuth2: Token auto-injected via route interception:', body);
});


// ── 6. OAuth2 — Expired token returns 401 with WWW-Authenticate header ─────────
test('OAuth2 — expired token response includes WWW-Authenticate header', async ({ page }) => {
  await page.route('https://api.example.com/resource', async (route) => {
    const authHeader = route.request().headers()['authorization'];
    const token = authHeader?.replace('Bearer ', '');

    if (token === 'expired_token') {
      await route.fulfill({
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer realm="api", error="invalid_token", error_description="Token has expired"',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'invalid_token', error_description: 'Token has expired' }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('https://example.com');

  let capturedHeaders: Record<string, string> = {};
  page.on('response', (res) => {
    if (res.url().includes('/resource')) capturedHeaders = res.headers();
  });

  const result = await page.evaluate(async () => {
    const res = await fetch('https://api.example.com/resource', {
      headers: { Authorization: 'Bearer expired_token' },
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(401);
  expect(result.data.error).toBe('invalid_token');
  expect(capturedHeaders['www-authenticate']).toContain('invalid_token');
  console.log('✅ OAuth2: WWW-Authenticate header present on 401:', capturedHeaders['www-authenticate']);
});
