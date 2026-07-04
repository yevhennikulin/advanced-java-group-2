import type { Exercise } from '../types';

const STORAGE_KEY = 'favorites';

function saveFavorites(favorites: Exercise[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  document.dispatchEvent(new CustomEvent('favorites:change', { detail: { favorites } }));
}

export function getFavorites(): Exercise[] {
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

export function toggleFavorite(exercise: Exercise): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex(item => item._id === exercise._id);

  if (index === -1) {
    favorites.push(exercise);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  return index === -1;
}

export function removeFavorite(id: string): void {
  saveFavorites(getFavorites().filter(item => item._id !== id));
}
