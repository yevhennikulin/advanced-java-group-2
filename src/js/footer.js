import { subscribe } from './api.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  // Automatically display the current copyright year
  const yearSpan = document.getElementById('footer-year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Handle subscription form submissions
  const form = document.getElementById('footer-subscription-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = form.querySelector('.subscription-input');
      if (!input) return;

      const email = input.value.trim();
      if (!email) return;

      try {
        await subscribe(email);
        iziToast.success({
          title: 'Success',
          message: 'You have successfully subscribed to our newsletter!',
          position: 'topRight',
          timeout: 5000
        });
        form.reset();
      } catch (err) {
        iziToast.error({
          title: 'Error',
          message: err.message || 'Subscription failed. Please try again later.',
          position: 'topRight',
          timeout: 5000
        });
      }
    });
  }
});
