const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: false,
  retries: 0,
  timeout: 60000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run start:backend',
      port: 3030,
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'npm run start:frontend',
      port: 3000,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
