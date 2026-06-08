import { test,expect } from '@playwright/test';
// Define a union type for user roles
type Role = 'Admin' | 'Manager' | 'User';

type LoginData = {
  username: string;
  password: string;
};

type ProfileData = {
  role: Role;
  greeting: string;
};

//Intersection type to combine LoginData and ProfileData
type TestUser = LoginData & ProfileData;

test('Role Greeting Validation', async ({ page }) => {

  const user: TestUser = {
    username: 'manager1',
    password: 'Password123',
    role: 'Manager',
    greeting: 'Welcome Manager'
  };

  // Simulate login and profile validation in a web application
  
  await page.goto('http://localhost:3000');

  await page.fill('#username', user.username);

  await page.fill('#password', user.password);

  await page.click('#login');

  await page.locator('#greeting').waitFor();

  await expect(page.locator('#greeting'))
      .toHaveText(user.greeting);
});