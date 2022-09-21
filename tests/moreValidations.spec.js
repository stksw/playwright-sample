const { test, expect } = require('@playwright/test');
const { API_URL } = require('../utils/ApiUtils');

test('web popup validations', async ({ page }) => {
  await page.goto(`${API_URL}/AutomationPractice/`);
  // await page.goto('https://google.com');
  // await page.goBack();
  // await page.goForward();

  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();

  // await page.pause();
  page.on('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmbtn').click();
  await page.locator('#mousehover').hover();
  const framesPage = page.frameLocator('#courses-iframe');
  await framesPage.locator('li a[href*="lifetime-access"]:visible').click();
  const textCheck = await framesPage.locator('.text h2').textContent();
  expect(await textCheck.split(' ')[1]).toBe('13,522');

  let title = await page.title();
  title = await title.replace(/ /g, '-');
  console.log('page', title);
});
