import { SquareClient, SquareEnvironment } from 'square';

export const handler = async (request) => {
  if (request.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the request body
    const body = JSON.parse(request.body);

    // Destructure the body
    const { idempotencyKey, sourceId, amount, locationId } = body;

    // Get the Square access token
    const accessToken = process.env.VITE_SQUARE_ACCESS_TOKEN;

    // Create a new Square client
    const client = new SquareClient({
      token: accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    // Create the request body
    const requestBody = {
      sourceId,
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD',
      },
      idempotencyKey,
      locationId,
    };

    // Create a new payment
    console.log(client.payments.create);
    console.log('');
    console.log('');
    console.log('');
    const response = await client.payments.create(requestBody);

    console.log('SUCCESS! ');
    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify(response.result),
    };
  } catch (error) {
    // Return an error
    console.error('Error creating payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
