import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Full CRUD API Interception Examples
// Target: https://jsonplaceholder.typicode.com
// Covers: GET · POST · PUT · PATCH · DELETE
// ─────────────────────────────────────────────────────────────────────────────


// ══════════════════════════════════════════════════════════════════════════════
// GET — Read resource(s)
// ══════════════════════════════════════════════════════════════════════════════

test('GET /posts — modify list response', async ({ page }) => {
  await page.route('**/posts', async (route) => {
    // Only intercept GET requests
    if (route.request().method() !== 'GET') return route.continue();

    const response = await route.fetch();
    const posts: any[] = await response.json();

    // Modify every post title in the list
    const modified = posts.map((post) => ({
      ...post,
      title: `[GET MODIFIED] ${post.title}`,
    }));

    await route.fulfill({ response, json: modified });
  });

  await page.goto('https://jsonplaceholder.typicode.com/posts');
  await expect(page.getByText('[GET MODIFIED]').first()).toBeVisible();
  console.log('✅ GET: List response modified');
});


test('GET /posts/1 — modify single resource response', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'GET') return route.continue();

    const response = await route.fetch();
    const post: any = await response.json();

    await route.fulfill({
      response,
      json: {
        ...post,
        title: 'Overridden Title via GET Intercept',
        body: 'This body was replaced by Playwright before reaching the browser.',
      },
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  await expect(page.getByText('Overridden Title via GET Intercept')).toBeVisible();
  console.log('✅ GET: Single resource modified');
});


// ══════════════════════════════════════════════════════════════════════════════
// POST — Create resource
// ══════════════════════════════════════════════════════════════════════════════

test('POST /posts — intercept create request and modify response', async ({ page }) => {
  let capturedRequestBody: any = null;

  await page.route('**/posts', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();

    // Capture what the client sent
    capturedRequestBody = route.request().postDataJSON();
    console.log('   📤 POST request body:', capturedRequestBody);

    // Fetch the real response (JSONPlaceholder echoes back what you sent + id)
    const response = await route.fetch();
    const created: any = await response.json();

    // Modify the server's response before it reaches the client
    await route.fulfill({
      response,
      json: {
        ...created,
        id: 9999,                          // Override the assigned ID
        status: 'created',                 // Add extra field
        createdAt: new Date().toISOString(),
      },
    });
  });

  // Trigger a POST request from the browser context
  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Post from Playwright',
        body: 'Testing POST interception',
        userId: 1,
      }),
    });
    return res.json();
  });

  // Verify the interceptor modified the response
  expect(result.id).toBe(9999);
  expect(result.status).toBe('created');
  expect(result.createdAt).toBeDefined();
  expect(capturedRequestBody.title).toBe('New Post from Playwright');
  console.log('✅ POST: Response modified:', result);
});


test('POST /posts — simulate validation error response', async ({ page }) => {
  await page.route('**/posts', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();

    const body = route.request().postDataJSON();

    // Simulate server-side validation: reject posts with empty title
    if (!body?.title || body.title.trim() === '') {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unprocessable Entity',
          message: 'Title is required',
          field: 'title',
        }),
      });
      return;
    }

    // Valid request — pass through normally
    await route.continue();
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  // Fire a POST with missing title
  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', body: 'some body', userId: 1 }),
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(422);
  expect(result.data.field).toBe('title');
  console.log('✅ POST: Validation error simulated:', result);
});


// ══════════════════════════════════════════════════════════════════════════════
// PUT — Full update (replace entire resource)
// ══════════════════════════════════════════════════════════════════════════════

test('PUT /posts/1 — intercept full update and modify response', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'PUT') return route.continue();

    const requestBody = route.request().postDataJSON();
    console.log('   📤 PUT request body:', requestBody);

    const response = await route.fetch();
    const updated: any = await response.json();

    // Add audit fields to the response
    await route.fulfill({
      response,
      json: {
        ...updated,
        updatedAt: new Date().toISOString(),
        updatedBy: 'playwright-test-user',
        version: 2,
      },
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        title: 'Completely Replaced Title',
        body: 'Completely replaced body via PUT',
        userId: 1,
      }),
    });
    return res.json();
  });

  expect(result.updatedBy).toBe('playwright-test-user');
  expect(result.version).toBe(2);
  expect(result.updatedAt).toBeDefined();
  console.log('✅ PUT: Full update response modified:', result);
});


test('PUT /posts/999 — simulate 404 for non-existent resource', async ({ page }) => {
  await page.route('**/posts/999', async (route) => {
    if (route.request().method() !== 'PUT') return route.continue();

    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Not Found',
        message: 'Post with id 999 does not exist',
        id: 999,
      }),
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/999', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Ghost Post', body: 'Does not exist', userId: 1 }),
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(404);
  expect(result.data.message).toContain('999');
  console.log('✅ PUT: 404 for missing resource simulated:', result);
});


// ══════════════════════════════════════════════════════════════════════════════
// PATCH — Partial update (modify specific fields only)
// ══════════════════════════════════════════════════════════════════════════════

test('PATCH /posts/1 — intercept partial update and modify response', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'PATCH') return route.continue();

    const patchFields = route.request().postDataJSON();
    console.log('   📤 PATCH fields:', patchFields);

    const response = await route.fetch();
    const patched: any = await response.json();

    await route.fulfill({
      response,
      json: {
        ...patched,
        patchedAt: new Date().toISOString(),
        patchedFields: Object.keys(patchFields), // Track which fields were patched
      },
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Only Title Was Patched' }), // Only updating title
    });
    return res.json();
  });

  expect(result.patchedFields).toContain('title');
  expect(result.patchedFields).not.toContain('body'); // body wasn't patched
  expect(result.patchedAt).toBeDefined();
  console.log('✅ PATCH: Partial update response modified:', result);
});


test('PATCH /posts/1 — simulate optimistic lock conflict (409)', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'PATCH') return route.continue();

    const body = route.request().postDataJSON();

    // Simulate: reject if client sends an outdated version number
    if (body?.version && body.version < 5) {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Conflict',
          message: 'Stale version. Current version is 5, you sent version ' + body.version,
          currentVersion: 5,
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title', version: 3 }), // outdated version
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(409);
  expect(result.data.currentVersion).toBe(5);
  console.log('✅ PATCH: 409 Conflict simulated:', result);
});


// ══════════════════════════════════════════════════════════════════════════════
// DELETE — Remove resource
// ══════════════════════════════════════════════════════════════════════════════

test('DELETE /posts/1 — intercept and return custom delete confirmation', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'DELETE') return route.continue();

    // JSONPlaceholder returns an empty {} on DELETE
    // We override it with a richer confirmation response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Post deleted successfully',
        deletedId: 1,
        deletedAt: new Date().toISOString(),
      }),
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE',
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(200);
  expect(result.data.success).toBe(true);
  expect(result.data.deletedId).toBe(1);
  console.log('✅ DELETE: Confirmation response modified:', result);
});


test('DELETE /posts/1 — simulate 403 Forbidden (no permission)', async ({ page }) => {
  await page.route('**/posts/1', async (route) => {
    if (route.request().method() !== 'DELETE') return route.continue();

    await route.fulfill({
      status: 403,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Forbidden',
        message: 'You do not have permission to delete this post',
        requiredRole: 'admin',
      }),
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE',
    });
    return { status: res.status, data: await res.json() };
  });

  expect(result.status).toBe(403);
  expect(result.data.requiredRole).toBe('admin');
  console.log('✅ DELETE: 403 Forbidden simulated:', result);
});


// ══════════════════════════════════════════════════════════════════════════════
// COMBINED — All methods on one route, dispatched by method
// ══════════════════════════════════════════════════════════════════════════════

test('ALL METHODS — single route handler dispatches by HTTP method', async ({ page }) => {
  const log: string[] = [];

  await page.route('**/posts/1', async (route) => {
    const method = route.request().method();
    log.push(method);

    switch (method) {
      case 'GET': {
        const res = await route.fetch();
        const json = await res.json();
        return route.fulfill({ response: res, json: { ...json, _intercepted: 'GET' } });
      }

      case 'POST': {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 101, _intercepted: 'POST' }),
        });
      }

      case 'PUT': {
        const res = await route.fetch();
        const json = await res.json();
        return route.fulfill({ response: res, json: { ...json, _intercepted: 'PUT' } });
      }

      case 'PATCH': {
        const res = await route.fetch();
        const json = await res.json();
        return route.fulfill({ response: res, json: { ...json, _intercepted: 'PATCH' } });
      }

      case 'DELETE': {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ _intercepted: 'DELETE', deletedId: 1 }),
        });
      }

      default:
        return route.continue();
    }
  });

  await page.goto('https://jsonplaceholder.typicode.com');

  // Fire all 4 methods from the browser
  await page.evaluate(async () => {
    await fetch('https://jsonplaceholder.typicode.com/posts/1');                                                               // GET
    await fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PUT',    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'x' }) });  // PUT
    await fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'PATCH',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'x' }) });  // PATCH
    await fetch('https://jsonplaceholder.typicode.com/posts/1', { method: 'DELETE' });                                        // DELETE
  });

  expect(log).toContain('GET');
  expect(log).toContain('PUT');
  expect(log).toContain('PATCH');
  expect(log).toContain('DELETE');
  console.log('✅ ALL METHODS: Dispatched correctly:', log);
});
