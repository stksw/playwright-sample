const { test, expect } = require('@playwright/test');

test.describe('login test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.LOGIN_TEST_URL);
  });

  test('login fails without username', async ({ page }) => {
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*='block']")).toContainText('Empty');
  });

  test('login fails without password', async ({ page }) => {
    await page.locator('#username').type('rahulshetty');
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*='block']")).toContainText('Empty');
  });

  test('login fails by incorrect username', async ({ page }) => {
    await page.locator('#username').type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await page.locator('#signInBtn').click();
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
  });

  test('ui controls', async ({ page }) => {
    const terms = await page.locator('#terms');
    await terms.click();
    expect(terms).toBeChecked();

    await terms.uncheck();
    expect(await terms.isChecked()).toBeFalsy();

    const documentLink = await page.locator("[href*='documents-request']");
    expect(await documentLink.getAttribute('class')).toBe('blinkingText');
  });
});

test.describe('login test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.LOGIN_TEST_URL);
  });

  test('login successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/LoginPage/);

    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").fill('learning');
    await page.locator('#login-form select').selectOption('consult');
    await page.locator('.radiotextsty').last().click();
    await page.locator('#okayBtn').click();
    expect(await page.locator('.radiotextsty').last()).toBeChecked();

    await page.locator('.termsText').click();
    expect(await page.locator('#terms')).toBeChecked();
    await page.locator('#signInBtn').click();

    const item = await page.locator('.card-body a').nth(1).textContent();
    expect(item).toBe('Samsung Note 8');

    const allItems = await page.locator('.card-body a').allTextContents();
    // console.log(allItems);
    // ['iphone X', 'Samsung Note 8', 'Nokia Edge', 'Blackberry']

    // page.on('request', (request) => console.log(request.url()));
    // page.on('response', (response) =>
    //   console.log(response.url(), response.status())
    // );
  });

  test('login successfully other code', async ({ page }) => {
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator("[type='password']").fill('learning');
    await page.locator('#login-form select').selectOption('consult');
    await page.locator('.radiotextsty').last().click();
    await page.locator('#okayBtn').click();

    await Promise.all([
      page.waitForNavigation(),
      page.locator('#signInBtn').click(),
    ]);

    const item = await page.locator('.card-body a').nth(1).textContent();
    expect(item).toBe('Samsung Note 8');
  });
});

test('child window handle', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(process.env.LOGIN_TEST_URL);
  const documentLink = page.locator("[href*='documents-request']");

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
  ]);

  const text = await newPage.locator('.red').textContent();
  const arrayText = text.split('@');
  const domain = arrayText[1].split(' ')[0];
  expect(domain).toBe('rahulshettyacademy.com');

  await page.locator('#username').type(domain);
  await page.pause();
  console.log(await page.locator('#username').textContent());
});
