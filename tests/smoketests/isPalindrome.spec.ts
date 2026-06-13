// Test for the isPalindrome function using playwright test framework
import { test, expect } from '@playwright/test';
import { isPalindrome } from '../src/isPalindrome';

test.describe('isPalindrome', () => {
    test('should return true for a palindrome string', () => {
        expect(isPalindrome('A man, a plan, a canal, Panama')).toBe(true);
    });

    test('should return false for a non-palindrome string', () => {
        expect(isPalindrome('Hello, World!')).toBe(false);
    }); 
}
);
