import { test, expect } from '@playwright/test';
//import dotenv from 'dotenv';

//dotenv.config();

test('Validate GitHub repository exists', async ({ request }) => {

    const repoName = 'TCS';

    const response = await request.get(
        `https://api.github.com/repos/balamurthy6268-web/TCS`,
        {
            headers: {
                Authorization: `Bearer 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`,
                Accept: 'application/vnd.github+json'
            }
        }
    );

    expect(response.status()).toBe(200);

    const repo = await response.json();

    expect(repo.name).toBe(repoName);
    expect(repo.owner.login)
        .toBe('balamurthy6268-web');

    expect(repo.private).toBeFalsy(); // adjust if private repo
});