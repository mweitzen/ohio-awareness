const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;

/**
 * Initialize the card payment form
 *
 */
async function initializeCard(payments) {
  const cardOptions = {
    style: {
      input: {
        backgroundColor: 'white',
      },
    },
  };

  const card = await payments.card(cardOptions);
  await card.attach('#card');

  return card;
}

/**
 * Create a payment using the Square API
 *
 */
async function createPayment(amount, token) {
  const body = JSON.stringify({
    locationId,
    sourceId: token,
    idempotencyKey: window.crypto.randomUUID(),
    amount: amount,
  });

  const response = await fetch('/.netlify/functions/square', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (response.ok) {
    console.log('Payment Success');
    return;
  }

  console.log('Payment Failure');
  const error = await response.text();
  throw new Error(error);
}

/**
 * Tokenize payment information using the Square API
 *
 */
async function tokenize(paymentMethod) {
  const result = await paymentMethod.tokenize();

  if (result.status === 'OK') {
    return result.token;
  } else {
    let errorMessage = `Tokenization failed-status: ${result.status}`;
    if (result.errors) {
      errorMessage += ` and errors: ${JSON.stringify(result.errors)}`;
    }
    throw new Error(errorMessage);
  }
}

/**
 * Display payment results to the user
 *
 */
function displayPaymentResults(status) {
  const statusContainer = document.getElementById('payment-status-container');

  console.log('Status -->', status);

  if (status === 'SUCCESS') {
    console.log('Inside --> Payment Success');
    statusContainer.classList.remove('is-failure');
    statusContainer.classList.add('is-success');
  } else {
    console.log('Inside --> Payment Failure');
    console.log('Hmmmmmmm.......');
    statusContainer.classList.remove('is-success');
    statusContainer.classList.add('is-failure');
  }

  statusContainer.style.visibility = 'visible';
}

/**
 * Main function
 * Attach the card form to the DOM and add an event listener to the pay button
 *
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Check if the Square SDK has loaded
  if (!window.Square) {
    throw new Error('Square.js failed to load properly');
  }

  // Initialize the Square Payments SDK
  const payments = window.Square.payments(applicationId, locationId);

  // Initialize the card payment form
  let card;
  try {
    card = await initializeCard(payments);
  } catch (error) {
    console.error('Initializing Card failed', error);
    return;
  }

  console.log('Card Initialized');

  // Add an event listener to the button
  const cardButton = document.getElementById('pay');

  // Check if the button exists
  if (!cardButton) {
    throw new Error('Pay button not found');
  }

  // Add an event listener to the button
  cardButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const price = event.target.value;

    try {
      cardButton.disabled = true;
      const token = await tokenize(card);
      await createPayment(price, token);
      displayPaymentResults('SUCCESS');

      // Redirect user to success page
      return (window.location.href = '/success');
    } catch (e) {
      console.log('HMMMMMMMMM.............');
      console.log(e);
      cardButton.disabled = false;
      displayPaymentResults('FAILURE');
      console.error(e.message);
    }
  });
});
