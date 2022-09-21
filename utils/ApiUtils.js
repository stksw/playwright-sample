export const API_URL = process.env.API_URL || 'https://rahulshettyacademy.com';

export class ApiUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      `${API_URL}/api/ecom/auth/login`,
      { data: this.loginPayload }
    );
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    return token;
  }

  async createOrder(payload) {
    const token = await this.getToken();
    const response = await this.apiContext.post(
      `${API_URL}/api/ecom/order/create-order`,
      {
        data: payload,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    const responseJson = await response.json();

    const orderId = responseJson.orders[0];
    response.orderId = orderId;

    return response;
  }
}
