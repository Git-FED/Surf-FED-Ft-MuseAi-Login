const ageGate = document.getElementById('ageGate');
const supportOptions = document.getElementById('supportOptions');
const ageConfirm = document.getElementById('ageConfirm');
const paypalStatus = document.getElementById('paypalStatus');
let providersInitialized = false;

function loadScript(src, attributes = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    for (const [key, value] of Object.entries(attributes)) script.setAttribute(key, value);
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

function revealSupportOptions() {
  ageGate.hidden = true;
  supportOptions.hidden = false;
  document.querySelectorAll('#supportOptions [data-src]').forEach((element) => {
    element.src = element.dataset.src;
    delete element.dataset.src;
  });
  initializePaymentProviders();
}

async function initializePaymentProviders() {
  if (providersInitialized) return;
  providersInitialized = true;

  try {
    await loadScript('https://www.paypal.com/sdk/js?client-id=BAA_ndqaWMyQwTnDZ0LXwLQ22jdJo9uxkeXYqmBbF-hD41HMiZ83mvOcx1Kti0b6ZfXfje7Q1ievNaS8Ok&vault=true&intent=subscription', {
      'data-sdk-integration-source': 'button-factory'
    });
    window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
      createSubscription: (data, actions) => actions.subscription.create({
        plan_id: 'P-4FD24238VX4902214NK2XP2Y',
        quantity: 1
      }),
      onApprove: (data) => {
        paypalStatus.textContent = `Subscription approved. PayPal subscription ID: ${data.subscriptionID}`;
      },
      onError: () => {
        paypalStatus.textContent = 'PayPal could not load or complete this action. Please try again later.';
      }
    }).render('#paypal-button-container-P-4FD24238VX4902214NK2XP2Y');
  } catch (error) {
    paypalStatus.textContent = 'PayPal could not be loaded. Please check your connection or try again later.';
  }


  try {
    await loadScript('https://js.stripe.com/v3/buy-button.js');
  } catch (error) {
    const stripeCard = document.querySelector('stripe-buy-button')?.closest('.support-card');
    if (stripeCard) {
      const note = document.createElement('p');
      note.className = 'payment-status';
      note.setAttribute('role', 'status');
      note.textContent = 'Stripe could not be loaded. Please check your connection or try again later.';
      stripeCard.appendChild(note);
    }
  }
}

ageConfirm.addEventListener('click', () => {
  try { sessionStorage.setItem('surf-fed-age-confirmed', 'true'); } catch (error) { /* Continue for this page view. */ }
  revealSupportOptions();
});

try {
  if (sessionStorage.getItem('surf-fed-age-confirmed') === 'true') revealSupportOptions();
} catch (error) {
  // If storage is unavailable, require confirmation again on this page view.
}

