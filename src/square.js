const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
const accessToken = import.meta.env.VITE_SQUARE_ACCESS_TOKEN;

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.Square) {
    throw new Error('Square.js failed to load properly');
  }

  // Set up the card options
  const cardOptions = {
    style: {
      input: {
        backgroundColor: 'white',
      },
    },
  };

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

  // Handle the form submission
  async function handlePaymentMethodSubmission(event, paymentMethod) {
    event.preventDefault();

    try {
      // disable the submit button as we await tokenization and make a
      // payment request.
      cardButton.disabled = true;
      const token = await tokenize(paymentMethod);
      const paymentResults = await createPayment(token);
      displayPaymentResults('SUCCESS');

      console.debug('Payment Success', paymentResults);
    } catch (e) {
      cardButton.disabled = false;
      displayPaymentResults('FAILURE');
      console.error(e.message);
    }
  }

  // Add an event listener to the button
  const cardButton = document.getElementById('pay');

  cardButton.addEventListener('click', async function (event) {
    await handlePaymentMethodSubmission(event, card);
  });
});

/**
 * Initialize the Square card payment form
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
 * @returns {Promise<void>}
 */
async function createPayment() {
  const body = JSON.stringify({
    locationId,
    sourceId: accessToken,
    idempotencyKey: window.crypto.randomUUID(),
  });

  const response = await fetch('/api/square/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (response.ok) {
    return response.json();
  }

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
    let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
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
  if (status === 'SUCCESS') {
    statusContainer.classList.remove('is-failure');
    statusContainer.classList.add('is-success');
  } else {
    statusContainer.classList.remove('is-success');
    statusContainer.classList.add('is-failure');
  }

  statusContainer.style.visibility = 'visible';
}
