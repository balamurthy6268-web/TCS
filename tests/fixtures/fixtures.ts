import { test as base} from '@playwright/test';

export const test = base.extend<{envName: string;}>
({
  envName: async ({}, use) => {
    await use('staging');
  },
});
