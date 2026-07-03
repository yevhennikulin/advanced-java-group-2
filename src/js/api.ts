import axios, { AxiosResponse } from 'axios';
import type {
  FilterCategory,
  FilterCategoriesResponse,
  Exercise,
  ExercisesResponse,
  Quote,
  SubscriptionResponse,
  RatingRequest,
  SearchExercisesParams,
} from './types';

const api = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
});

// ============================================
// FILTER CATEGORIES
// ============================================

/**
 * Get categories for a filter type (Muscles, Body parts, Equipment)
 * Used when clicking filter buttons to show category cards
 *
 * @example
 * const { data } = await getFilterCategories('Muscles', 1, 12);
 */
export function getFilterCategories(
  filter: FilterCategory['filter'] = 'Muscles',
  page: number = 1,
  limit: number = 12
): Promise<AxiosResponse<FilterCategoriesResponse>> {
  return api.get('/filters', { params: { filter, page, limit } });
}

// ============================================
// EXERCISES BY CATEGORY
// Used when clicking a category card
// ============================================

/**
 * Get exercises filtered by muscle
 */
export function getExercisesByMuscle(
  muscle: string,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { muscles: muscle, page, limit } });
}

/**
 * Get exercises filtered by body part
 */
export function getExercisesByBodyPart(
  bodypart: string,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { bodypart, page, limit } });
}

/**
 * Get exercises filtered by equipment
 */
export function getExercisesByEquipment(
  equipment: string,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { equipment, page, limit } });
}

// ============================================
// SEARCH EXERCISES
// Dynamic search with filter context + keyword
// ============================================

/**
 * Search exercises with dynamic filter and keyword
 * Single method that handles all filter types
 *
 * @example
 * searchExercises({ filter: 'muscles', category: 'lats', keyword: 'pull' });
 */
export function searchExercises({
  filter,
  category,
  keyword,
  page = 1,
  limit = 10,
}: SearchExercisesParams = {}): Promise<AxiosResponse<ExercisesResponse>> {
  const params: Record<string, string | number> = { page, limit };

  if (filter && category) {
    params[filter] = category;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  return api.get('/exercises', { params });
}

// ============================================
// EXERCISE DETAILS
// Used for modal window
// ============================================

/**
 * Get single exercise by ID (for modal)
 */
export function getExerciseById(
  id: string
): Promise<AxiosResponse<Exercise>> {
  return api.get(`/exercises/${id}`);
}

// ============================================
// EXERCISE RATING (Optional feature)
// ============================================

/**
 * Add rating to an exercise
 */
export function addExerciseRating(
  id: string,
  { rate, email, review }: RatingRequest
): Promise<AxiosResponse<Exercise>> {
  return api.patch(`/exercises/${id}/rating`, { rate, email, review });
}

// ============================================
// QUOTE OF THE DAY
// ============================================

/**
 * Get quote of the day
 */
export function getQuote(): Promise<AxiosResponse<Quote>> {
  return api.get('/quote');
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

/**
 * Subscribe to newsletter
 */
export function subscribe(
  email: string
): Promise<AxiosResponse<SubscriptionResponse>> {
  return api.post('/subscription', { email });
}
