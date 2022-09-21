const { test, expect, request } = require('@playwright/test');
const { APiUtils, API_URL } = require('../utils/APiUtils');

const loginPayload = {
  userEmail: 'anshika@gmail.com',
  userPassword: 'Iamking@000',
};
const orderPayLoad = {
  orders: [{ country: 'Cuba', productOrderedId: '62023a7616fcf72fe9dfc619' }],
};
const fakePayloadOrders = { data: [], message: 'No Orders' };
let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayLoad);
});

test.skip('place order', async ({ page }) => {
  await page.route(
    `${API_URL}/api/ecom/order/get-orders-for-customer/62026f4edfa52b09e0a20b18`,
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = fakePayloadOrders;
      route.fulfill({ response, body });
    }
    //intercepting response - APi response->{ playwright fakeresponse}->browser->render data on front end
  );

  await page.route(
    `${API_URL}/api/ecom/order/get-orders-for-customer/62026f4edfa52b09e0a20b18`,
    async (route) => {
      route.continue({
        url: `${API_URL}/api/ecom/order/get-orders-for-customer/62026f4edfa52b09xxxxx`,
      });
    }
  );

  await page.locator('button:has-text("View")').first().click();
  await page.locator('tbody').waitFor();
  const rows = await page.locator('tobdy tr');
});
