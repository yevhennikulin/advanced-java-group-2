/*
  RATING MODAL CONTROLLER
  =======================

  Opened by the "Give a rating" button in the exercise modal (see src/js/modal.ts).
  Lazily queries #rating-modal on first call to openRatingModal().

  Reuses:
  - show/hide/backdrop/ESC wiring from src/js/modal-common.ts (shared with the
    exercise modal instead of re-implementing it here).
  - the same "./img/icons.svg#star" sprite icon + opacity-based empty/filled
    convention already used for star rendering in src/js/exercise-list.ts /
    src/css/exercise-list.css (.exercise-card__star--empty), adapted here for
    an interactive 1-5 star radio group instead of a read-only rating display.

  Validation is entirely native: the 5 star radios (name="rate", required),
  the email input (type="email" + pattern) and the review textarea (required)
  are validated by the browser's constraint validation before the "submit"
  event ever reaches this module -- there's no manual regex/empty check and
  no "is-invalid" class. iziToast is only used to report an actual API failure
  on submit, matching the pattern in src/js/footer.ts.
*/

import { addExerciseRating } from './api';
import { createModalController, type ModalController } from './modal-common';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const TOTAL_STARS = 5;

let initialized = false;

let modalController: ModalController;
let form: HTMLFormElement;
let starsContainer: HTMLElement;
let ratingValueField: HTMLElement;
let submitBtn: HTMLButtonElement;

let currentExerciseId: string | null = null;

function renderStarInputs(): void {
  starsContainer.innerHTML = Array.from({ length: TOTAL_STARS })
    .map((_, index) => {
      const value = index + 1;
      return `
        <input class="visually-hidden" type="radio" name="rate" id="rating-star-${value}" value="${value}" required />
        <label class="rating-modal__star" for="rating-star-${value}" data-star="${value}" aria-label="${value} star${value > 1 ? 's' : ''}">
          <svg class="rating-modal__star-icon rating-modal__star-icon--empty" width="24" height="24" aria-hidden="true">
            <use href="./img/icons.svg#star" />
          </svg>
        </label>
      `;
    })
    .join('');
}

function setRatingValue(value: number): void {
  ratingValueField.textContent = value.toFixed(1);

  starsContainer.querySelectorAll<HTMLElement>('.rating-modal__star').forEach(label => {
    const starValue = Number(label.dataset.star);
    const icon = label.querySelector('.rating-modal__star-icon');
    icon?.classList.toggle('rating-modal__star-icon--empty', starValue > value);
  });
}

function resetForm(): void {
  form.reset();
  setRatingValue(0);
}

function ensureInitialized(): boolean {
  if (initialized) return true;

  const modal = document.getElementById('rating-modal');
  if (!modal) return false;

  const formEl = modal.querySelector<HTMLFormElement>('.rating-modal__form');
  if (!formEl) return false;

  form = formEl;
  modalController = createModalController(modal);
  starsContainer = form.querySelector<HTMLElement>('[data-field="stars"]')!;
  ratingValueField = form.querySelector<HTMLElement>('[data-field="rating-value"]')!;
  submitBtn = form.querySelector<HTMLButtonElement>('.rating-modal__submit')!;

  renderStarInputs();

  starsContainer.addEventListener('change', event => {
    const target = event.target as HTMLInputElement | null;
    if (!target || target.name !== 'rate') return;
    setRatingValue(Number(target.value));
  });

  form.addEventListener('submit', event => {
    void handleSubmit(event);
  });

  initialized = true;
  return true;
}

async function handleSubmit(event: SubmitEvent): Promise<void> {
  // The browser only dispatches "submit" once native constraint validation
  // (required radios/email pattern/required textarea) has already passed.
  event.preventDefault();
  if (!currentExerciseId) return;

  const formData = new FormData(form);
  const rate = Number(formData.get('rate'));
  const email = String(formData.get('email') ?? '').trim();
  const review = String(formData.get('review') ?? '').trim();

  submitBtn.disabled = true;
  try {
    await addExerciseRating(currentExerciseId, { rate, email, review });
    iziToast.success({
      title: 'Thank you!',
      message: 'Your rating has been submitted successfully.',
      position: 'topRight',
      timeout: 5000,
    });
    modalController.hide();
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } }; message?: string };
    iziToast.error({
      title: 'Error',
      message:
        error.response?.data?.message || error.message || 'Failed to submit rating. Please try again later.',
      position: 'topRight',
      timeout: 5000,
    });
  } finally {
    submitBtn.disabled = false;
  }
}

export function openRatingModal(exerciseId: string, onClose: () => void): void {
  if (!ensureInitialized()) return;

  currentExerciseId = exerciseId;
  resetForm();
  modalController.show(() => {
    currentExerciseId = null;
    resetForm();
    onClose();
  });
}
