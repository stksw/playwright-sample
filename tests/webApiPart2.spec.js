const { test, request, expect } = require('@playwright/test');
const { API_URL } = require('../utils/ApiUtils');
const { customTest } = require('../utils/testBase');

let webContext;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${API_URL}/client`);
  await page.locator('#userEmail').fill('anshika@gmail.com');
  await page.locator('#userPassword').fill('Iamking@000');
  await page.locator('[value="Login"]').click();
  await page.waitForLoadState('networkidle');
  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

customTest('client app login', async ({ page, testDataForOrder }) => {
  // const page = await webContext.newPage();
  await page.goto(`${API_URL}/client`);
  const products = page.locator('.card-body');
  const titles = await page.locator('.card-body b').allTextContents();
});
