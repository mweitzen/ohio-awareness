import { Client, Environment } from 'square';

export default async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { nonce, amount, currency } = body;

    if (!nonce || !amount || !currency) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN; // Get from environment variables
    const locationId = process.env.SQUARE_LOCATION_ID;

    const client = new Client({
      accessToken,
      environment: Environment.Production, // Or Environment.Sandbox for testing
    });

    const paymentsApi = client.paymentsApi;

    const requestBody = {
      sourceId: nonce,
      amountMoney: {
        amount: BigInt(amount), // Amount in smallest currency unit (e.g., cents)
        currency: currency,
      },
      idempotencyKey: require('crypto').randomBytes(36).toString('hex'), // Unique key to prevent duplicates
      locationId: locationId,
    };

    const response = await paymentsApi.createPayment(requestBody);

    return {
      statusCode: 200,
      body: JSON.stringify(response.result),
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
