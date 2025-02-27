document.addEventListener('DOMContentLoaded', () => {
  // Get the user type from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const userType = urlParams.get('role');

  const earlyBirdCutoff = new Date('2025-03-03');
  const currentDate = new Date();
  const isEarlyBird = currentDate < earlyBirdCutoff;

  // Calculate the price based on the user type
  let price = 0;
  switch (userType) {
    case 'doctor':
      price = 800;
      break;
    case 'nurse':
      price = 400;
      break;
    default:
      price = 0;
  }

  if (isEarlyBird) {
    price = price - 50;
  }

  // Show early bird discount
  if (isEarlyBird) {
    const discountContainer = document.getElementById('early-bird');
    discountContainer.classList.remove('hidden');
  }

  // Display the price to the user
  const priceContainer = document.getElementById('price');
  const regularPriceHtml = `<span class="line-through text-muted-foreground">$${
    price + 50
  }</span>`;
  const innerHTML = `Price: ${isEarlyBird ? regularPriceHtml : ''} $${price}`;
  priceContainer.innerHTML = innerHTML;

  // Update the pay button with the price
  const payButton = document.getElementById('pay');
  payButton.innerHTML = 'Pay: $' + price;
  payButton.value = price;
});
