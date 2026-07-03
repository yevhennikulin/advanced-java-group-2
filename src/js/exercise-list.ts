import type { Exercise } from './types';

export function renderExerciseCard(exercise: Exercise): string {
  return `
    <li class="exercise-card">
      <div class="exercise-card__header">
        <span class="exercise-card__badge">Workout</span>
        <span class="exercise-card__rating" aria-label="Rating ${exercise.rating} of 5">
          <span class="value">${exercise.rating.toFixed(1)}</span>
          <svg width="18" height="18">
            <use href="../../img/icons.svg#star" />
          </svg>
        </span>
        <button class="exercise-card__start" type="button" data-exercise-id="${exercise._id}">
          Start
          <svg width="16" height="16">
            <use href="../../img/icons.svg#arrow" />
          </svg>
        </button>
      </div>
      <h3 class="exercise-card__title">
        <svg class="exercise-card__icon" width="24" height="24">
          <use href="../../img/icons.svg#runner" />
        </svg>
        <span>${exercise.name}</span>
      </h3>
      <ul class="exercise-card__meta">
        <li>Burned calories: <span>${exercise.burnedCalories} / ${exercise.time} min</span></li>
        <li>Body part: <span>${exercise.bodyPart}</span></li>
        <li>Target: <span>${exercise.target}</span></li>
      </ul>
    </li>`;
}

export function renderExercisesList(exercises: Exercise[]): string {
  return exercises.map(renderExerciseCard).join('');
}
