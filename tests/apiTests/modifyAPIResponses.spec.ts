import { test, expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Target: https://jsonplaceholder.typicode.com
// This site calls its own API and renders the results — perfect for interception
// ─────────────────────────────────────────────────────────────────────────────

// ── TEST 1: Modify response body ─────────────────────────────────────────────
test('modify posts API — inject fake posts into response', async ({ page }) => {
  // Intercept GET /posts
  await page.route('**/posts', async (route) => {
    const response = await route.fetch();          // Hit the real server
    const posts: any[] = await response.json();    // Parse real response

    // Inject 2 fake posts at the top
    const fakePost = [
      { userId: 99, id: 999, title: '🚀 INJECTED POST by Playwright', body: 'This post was injected by intercepting the API response.' },
      { userId: 99, id: 998, title: '🛠️ Another FAKE post', body: 'Playwright modified this response before it reached the browser.' },
    ];

    const modified = [...fakePost, ...posts.slice(0, 3)]; // Keep first 3 real + 2 fake

    await route.fulfill({
      response,                    // Reuse original status + headers
      json: modified,              // Override with modified body
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com/posts');

  // Verify the injected post appears in the rendered page
  await expect(page.getByText('INJECTED POST by Playwright')).toBeVisible();
  console.log('✅ TEST 1 PASSED: Fake posts injected successfully');
});


// ── TEST 2: Modify a single resource ─────────────────────────────────────────
test('modify single user — change name and email', async ({ page }) => {
  await page.route('**/users/1', async (route) => {
    const response = await route.fetch();
    const user: any = await response.json();

    // Override specific fields
    const modified = {
      ...user,
      name: 'Playwright Tester',
      email: 'playwright@test.com',
      company: { ...user.company, name: 'Playwright Inc.' },
    };

    await route.fulfill({ response, json: modified });
  });

  await page.goto('https://jsonplaceholder.typicode.com/users/1');

  await expect(page.getByText('Playwright Tester')).toBeVisible();
  await expect(page.getByText('playwright@test.com')).toBeVisible();
  console.log('✅ TEST 2 PASSED: User details modified successfully');
});


// ── TEST 3: Simulate a 500 error ──────────────────────────────────────────────
test('simulate server error on todos endpoint', async ({ page }) => {
  await page.route('**/todos/1', async (route) => {
    // Don't fetch the real response — return a fake error
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Database connection failed',
        code: 'DB_CONN_ERROR',
      }),
    });
  });

  const response = await page.goto('https://jsonplaceholder.typicode.com/todos/1');

  expect(response?.status()).toBe(500);
  const body = await response?.json();
  expect(body.code).toBe('DB_CONN_ERROR');
  console.log('✅ TEST 3 PASSED: 500 error simulated successfully');
});


// ── TEST 4: Add custom headers to response ────────────────────────────────────
test('add custom headers to API response', async ({ page }) => {
  let capturedHeaders: Record<string, string> = {};

  await page.route('**/posts/1', async (route) => {
    const response = await route.fetch();
    const json = await response.json();

    await route.fulfill({
      response,
      json,
      headers: {
        ...response.headers(),
        'x-modified-by': 'playwright',
        'x-test-env': 'staging',
        'cache-control': 'no-store',
      },
    });
  });

  // Capture the response headers via page.on
  page.on('response', (res) => {
    if (res.url().includes('/posts/1')) {
      capturedHeaders = res.headers();
    }
  });

  await page.goto('https://jsonplaceholder.typicode.com/posts/1');

  expect(capturedHeaders['x-modified-by']).toBe('playwright');
  expect(capturedHeaders['x-test-env']).toBe('staging');
  console.log('✅ TEST 4 PASSED: Custom headers added successfully');
  console.log('   Headers:', capturedHeaders);
});


// ── TEST 5: Simulate slow network (add delay) ─────────────────────────────────
test('simulate slow API response — 2 second delay', async ({ page }) => {
  await page.route('**/comments?postId=1', async (route) => {
    const response = await route.fetch();
    const json = await response.json();

    // Simulate a 2 second network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await route.fulfill({ response, json });
  });

  const startTime = Date.now();
  await page.goto('https://jsonplaceholder.typicode.com/comments?postId=1');
  const elapsed = Date.now() - startTime;

  expect(elapsed).toBeGreaterThan(2000);
  console.log(`✅ TEST 5 PASSED: Response delayed by ${elapsed}ms`);
});


// ── TEST 6: Abort request (block an endpoint) ────────────────────────────────
test('abort specific API request', async ({ page }) => {
  let requestAborted = false;

  await page.route('**/photos/1', async (route) => {
    await route.abort('failed'); // Simulate network failure
  });

  page.on('requestfailed', (req) => {
    if (req.url().includes('/photos/1')) {
      requestAborted = true;
    }
  });

  await page.goto('https://jsonplaceholder.typicode.com/photos/1').catch(() => {
    // Navigation will fail since the main resource is aborted — expected
  });

  expect(requestAborted).toBe(true);
  console.log('✅ TEST 6 PASSED: Request aborted successfully');
});


// ── TEST 7: Conditional intercept based on URL param ─────────────────────────
test('conditionally modify response based on URL parameter', async ({ page }) => {
  await page.route('**/posts/**', async (route) => {
    const url = route.request().url();
    const postId = url.split('/posts/')[1];

    if (postId === '1') {
      const response = await route.fetch();
      const post: any = await response.json();

      await route.fulfill({
        response,
        json: {
          ...post,
          title: `[MODIFIED] ${post.title}`,
          body: 'This specific post was modified by Playwright interception.',
        },
      });
    } else {
      await route.continue(); // Pass all other posts through untouched
    }
  });

  await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  await expect(page.getByText('[MODIFIED]')).toBeVisible();
  console.log('✅ TEST 7 PASSED: Post 1 modified, others passed through');
});
