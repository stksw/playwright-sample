const { test, expect } = require('@playwright/test');
const { API_URL } = require('../utils/ApiUtils');

test.describe('multi window controls', () => {
  test('e-commerce payments and confirm', async ({ page }) => {
    const email = 'rahulshetty@gmail.com';
    await page.goto(`${API_URL}/client`);
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill('Iamking@000');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    const items = await page.locator('.card-body');
    const count = await items.count();

    for (let i = 0; i < count; ++i) {
      const itemName = await items.nth(i).locator('b').textContent();
      if (itemName === 'zara coat 3') {
        await items.nth(i).locator('text= Add To Cart').click();
        break;
      }
    }
    // await page.pause();
    await page.locator("[routerlink*='cart']").click();
    await page.locator('div li').first().waitFor();

    const bool = await page.locator('h3:has-text("zara coat 3")').isVisible();
    expect(bool).toBeTruthy();

    await page.locator('text=Checkout').click();
    await page.locator('[placeholder*="Country"]').type('ind', { delay: 100 });
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();

    const optionsCount = await dropdown.locator('button').count();
    for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator('button').nth(i).textContent();

      if (text === ' India') {
        await dropdown.locator('button').nth(i).click();
        break;
      }
    }
    const emailField = await page.locator('.user__name [type="text"]').first();
    expect(emailField).toHaveText(email);
    await page.locator('.action__submit').click();

    const messageEl = await page.locator('.hero-primary');
    await messageEl.waitFor();
    expect(messageEl).toHaveText('Thankyou for the order.');

    const orderId = await page
      .locator('.em-spacer-1 .ng-star-inserted')
      .textContent();
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = await page.locator('tbody tr');

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }

    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  });
});
