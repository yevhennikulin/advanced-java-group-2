/*
  EXERCISE MODAL CONTROLLER
  =========================

  Integration contract for the exercise card grid (built separately):
  any clickable element with [data-modal-open="exercise"][data-exercise-id="<id>"]
  opens this modal, via delegated click listener below. No direct import needed.
*/

import { getExerciseById } from './api';

import { isFavorite, toggleFavorite } from './services/favorites-service';
import type { Exercise } from './types';
import { openRatingModal } from './rating-modal';
import { createModalController } from './modal-common';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('exercise-modal');
  if (!modal) return;

  const favoriteBtn = modal.querySelector<HTMLButtonElement>('[data-modal-favorite-btn]')!;
  const ratingBtn = modal.querySelector<HTMLButtonElement>('[data-modal-rating-btn]')!;
  const modalController = createModalController(modal);

  const fields = {
    gif: modal.querySelector<HTMLImageElement>('[data-field="gif"]')!,
    name: modal.querySelector<HTMLElement>('[data-field="name"]')!,
    ratingValue: modal.querySelector<HTMLElement>('[data-field="rating-value"]')!,
    stars: modal.querySelector<HTMLElement>('[data-field="stars"]')!,
    target: modal.querySelector<HTMLElement>('[data-field="target"]')!,
    bodyPart: modal.querySelector<HTMLElement>('[data-field="bodyPart"]')!,
    equipment: modal.querySelector<HTMLElement>('[data-field="equipment"]')!,
    popularity: modal.querySelector<HTMLElement>('[data-field="popularity"]')!,
    calories: modal.querySelector<HTMLElement>('[data-field="calories"]')!,
    description: modal.querySelector<HTMLElement>('[data-field="description"]')!,
    favoriteLabel: modal.querySelector<HTMLElement>('[data-field="favorite-label"]')!,
  };

  const TOTAL_STARS = 5;

  let handleKeydown: ((event: KeyboardEvent) => void) | null = null;
  let currentExercise: Exercise | null = null;

  function renderFavoriteState(): void {
    if (!currentExercise) return;
    const active = isFavorite(currentExercise._id);
    favoriteBtn.setAttribute('aria-pressed', String(active));
    fields.favoriteLabel.textContent = active ? 'Remove favorite' : 'Add to favorites';
  }

  const STAR_PATH =
    'M5.53259 0.690968C5.83194 -0.230342 7.13535 -0.230343 7.4347 0.690968L8.27975 3.29178C8.41363 3.7038 8.79758 3.98276 9.23081 3.98276H11.9655C12.9342 3.98276 13.337 5.22238 12.5533 5.79178L10.3409 7.39917C9.99038 7.65381 9.84372 8.10518 9.9776 8.5172L10.8227 11.118C11.122 12.0393 10.0675 12.8055 9.28381 12.2361L7.07143 10.6287C6.72094 10.374 6.24634 10.374 5.89586 10.6287L3.68347 12.2361C2.89976 12.8055 1.84528 12.0393 2.14463 11.118L2.98969 8.51721C3.12356 8.10518 2.9769 7.65381 2.62642 7.39917L0.414034 5.79178C-0.36968 5.22238 0.0330949 3.98276 1.00182 3.98276H3.73647C4.1697 3.98276 4.55366 3.7038 4.68753 3.29178L5.53259 0.690968Z';

  function renderStars(rating: number): void {
    const filled = Math.min(TOTAL_STARS, Math.max(0, Math.round(rating || 0)));

    fields.stars.innerHTML = Array.from({ length: TOTAL_STARS })
      .map(
        (_, index) => `
          <span class="exercise-modal__star">
            <svg
              class="exercise-modal__star-icon${index < filled ? ' exercise-modal__star-icon--filled' : ''}"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              aria-hidden="true"
            >
              <path d="${STAR_PATH}"></path>
            </svg>
          </span>
        `
      )
      .join('');
  }

  function renderExercise(exercise: Exercise): void {
    currentExercise = exercise;
    if (exercise.gifUrl) {
      fields.gif.src = exercise.gifUrl;
      fields.gif.alt = exercise.name || '';
    } else {
      fields.gif.removeAttribute('src');
      fields.gif.alt = '';
    }
    fields.name.textContent = exercise.name || '';
    fields.ratingValue.textContent =
      typeof exercise.rating === 'number' ? exercise.rating.toFixed(1) : '';
    renderStars(exercise.rating);
    fields.target.textContent = exercise.target || '';
    fields.bodyPart.textContent = exercise.bodyPart || '';
    fields.equipment.textContent = exercise.equipment || '';
    fields.popularity.textContent = String(exercise.popularity ?? '');
    fields.calories.textContent =
      exercise.burnedCalories != null
        ? `${exercise.burnedCalories} Cal / ${exercise.time} min`
        : '';
    fields.description.textContent = exercise.description || '';
    renderFavoriteState();
  }

  function closeExerciseModal(): void {
    modalController.hide();
  }

  function showModal(): void {
    modalController.show();
  }

  async function openExerciseModal(id: string): Promise<void> {
    try {
      const { data } = await getExerciseById(id);
      renderExercise(data);
      showModal();
    } catch (error) {
      console.error('Failed to load exercise details:', error);
    }
  }

  favoriteBtn.addEventListener('click', () => {
    if (!currentExercise) return;
    toggleFavorite(currentExercise);
    renderFavoriteState();
  });

  ratingBtn.addEventListener('click', () => {
    if (!currentExercise) return;
    const exerciseId = currentExercise._id;
    closeExerciseModal();
    openRatingModal(exerciseId, showModal);
  });

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest<HTMLElement>('[data-modal-open="exercise"]');
    if (!trigger) return;

    event.preventDefault();

    const id = trigger.getAttribute('data-exercise-id');
    if (id) void openExerciseModal(id);
  });
});
