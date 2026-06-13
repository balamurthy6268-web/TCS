import { test } from '@playwright/test';
import { LoginFailedException } from '../utils/customException';

test('Login Validation', async ({ page }) => {

    await page.goto('https://example.com');

    const isVisible =
        await page.getByText('Welcome').isVisible();

    if (!isVisible) {
        throw new LoginFailedException(
            'Login successful page not displayed'
        );
    }
});