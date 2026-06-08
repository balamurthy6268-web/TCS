// Test for add function in playwright typescript
import { test, expect } from '@playwright/test';

function add(a: number, b: number): number {
    return a + b;
}

test('add function should return the sum of two numbers', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, -1)).toBe(-2);
    expect(add(-1, 2)).toBe(0);
    expect(add(0, 0)).toBe(0);
});
