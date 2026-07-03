import type { Exercise, FilterCategory } from './types';

function renderStars(rating: number): string {
  const MAX_STARS = 5;
  const full = Math.round(rating);

  return Array.from({ length: MAX_STARS }, (_, i) =>
    `<svg class="exercise-card__star${i < full ? '' : ' exercise-card__star--empty'}" width="14" height="14">
      <use href="../../img/icons.svg#star" />
    </svg>`
  ).join('');
}

export function renderExerciseCard(exercise: Exercise, index: number): string {
  return `
    <li class="exercise-card" style="--card-num: ${index}">
      <div class="exercise-card__header">
        <span class="exercise-card__badge">Workout</span>
        <span class="exercise-card__rating" aria-label="Rating ${exercise.rating} of 5">
          <span class="value">${exercise.rating.toFixed(1)}</span>
          ${renderStars(exercise.rating)}
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
  return exercises.map((ex, i) => renderExerciseCard(ex, i)).join('');
}

export function renderCategoryCard(item: FilterCategory, index: number): string {
  return `
    <li class="category-card" data-category="${item.name}" data-filter="${item.filter}" style="--card-num: ${index}">
      <img class="category-card-img" src="${item.imgURL}" alt="${item.name}" loading="lazy" />
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <h3 class="category-card-name">${item.name}</h3>
        <p class="category-card-filter">${item.filter}</p>
      </div>
    </li>`;
}

export function renderCategoryList(items: FilterCategory[]): string {
  return items.map((item, i) => renderCategoryCard(item, i)).join('');
}
