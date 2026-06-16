// If ../Config/ConfigEnv is not available, fall back to environment variables or defaults.

import { test } from '@playwright/test';
import { ConfigEnv } from '../Config/ConfigEnv';

test ('Login', async ({ page }) => {

//await page.goto(ConfigEnv.baseUrl);
/*
    await page.fill('#username', ConfigEnv.username);
    await page.fill('#password', ConfigEnv.password);
*/

console.log('Base URL:', ConfigEnv.baseUrl);
console.log('Username:', ConfigEnv.username);
console.log('Password:', ConfigEnv.password);



});
