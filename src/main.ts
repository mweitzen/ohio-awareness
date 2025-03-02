document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const earlyBirdDate = new Date('03-10-2025');

  const element = document.getElementById('early-bird-display');

  if (element === null) {
    throw new Error('Element not found');
  }

  if (now > earlyBirdDate) {
    element.style.display = 'none';
  }
});
