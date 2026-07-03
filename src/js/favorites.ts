import { getFavorites } from './services/favorites-service';
import { renderExerciseCard } from './exercise-list';

document.addEventListener('DOMContentLoaded', () => {
  const list: HTMLElement = document.getElementById('favorites-list')!;
  const empty: HTMLElement = document.getElementById('favorites-empty')!;

  if (!list || !empty) return;

  document.addEventListener('favorites:change', render);
  render();

  function render() {
    const favorites = getFavorites();

    if (!favorites.length) {
      list.innerHTML = '';
      empty.classList.remove('is-hidden');
      return;
    }

    empty.classList.add('is-hidden');
    list.innerHTML = favorites
      .map((item, i) => renderExerciseCard(item, i, true))
      .join('');
  }
});
