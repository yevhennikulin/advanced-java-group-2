/*
  FAVORITES (localStorage)
  ========================

  Stores favorite exercises as an array of exercise objects under the
  'favorites' key, so the favorites page can render them without another
  API call. Reusable by any module (exercise modal, favorites.html page).
*/

export interface IExercise {
  _id: string;
  name: string;
  target: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
}

const STORAGE_KEY = 'favorites';

export function getFavorites(): IExercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().some(exercise => exercise._id === id);
}

export function toggleFavorite(exercise: IExercise): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex(item => item._id === exercise._id);

  if (index === -1) {
    favorites.push(exercise);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  document.dispatchEvent(new CustomEvent('favorites:change', { detail: { favorites } }));

  return index === -1;
}
