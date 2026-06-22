import { Page, test, expect } from '@playwright/test';

function matchesPattern(value: string, pattern: RegExp | string): boolean {
  if (typeof pattern === 'string') {
    return value.includes(pattern);
  }
  return pattern.test(value);
}

test('Test to call reg ex pattern match function from generalUtils', async ({ page }) => {
  console.log(matchesPattern('admin123', /^[a-zA-Z]+\d+$/)); // true
  console.log(matchesPattern('Hi World Hello', 'World'));     // true
  console.log(matchesPattern('test@example.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)); // true (email check)
});