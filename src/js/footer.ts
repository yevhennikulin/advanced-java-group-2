import { subscribe } from './api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', (): void => {
  const yearSpan = document.getElementById('footer-year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  const form = document.getElementById('footer-subscription-form') as HTMLFormElement | null;
  if (form) {
    form.addEventListener('submit', async (e: SubmitEvent): Promise<void> => {
      e.preventDefault();

      const input = form.querySelector<HTMLInputElement>('.subscription-input');
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
        const error = err as Error;
        iziToast.error({
          title: 'Error',
          message: error.message || 'Subscription failed. Please try again later.',
          position: 'topRight',
          timeout: 5000
        });
      }
    });
  }
});
