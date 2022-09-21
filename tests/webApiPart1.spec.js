const { test, request, expect } = require('@playwright/test');
const { API_URL, ApiUtils } = require('../utils/ApiUtils');

let response;
let token;

const loginPayload = {
  userEmail: 'anshika@gmail.com',
  userPassword: 'Iamking@000',
};
const orderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '62023a7616fcf72fe9dfc619' }],
};

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayload);
  token = await apiUtils.getToken();

  // response = apiUtils.createOrder(orderPayload);
});

test('client app login', async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto(`${API_URL}/client`);
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator('tbody').waitFor();
  const rows = await page.locator('tbody tr');

  // for (let i = 0; i < (await rows.count()); ++i) {
  //   const rowOrderId = await rows.nth(i).locator('th').textContent();

  //   if (response.orderId.includes(rowOrderId)) {
  //     await rowOrderId.nth(i).locator('button').first().click();
  //     break;
  //   }
  // }
  // const orderIdDetails = await page.locator('.col-text').textContent();
  // console.log('order', orderIdDetails);
  // expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
