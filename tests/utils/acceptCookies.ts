import { Page } from '@playwright/test';

export async function acceptCookies(page: Page) {
  const acceptBtn = page.getByRole('button', { name: 'Accept All' });

  try {
    await acceptBtn.waitFor({ state: 'visible', timeout: 15000 });
    await acceptBtn.click({ force: true });
  } catch {
    // Banner didn't appear – safe to continue
  }
}
