import axios from 'axios';

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
 * @param {string} filter - Filter type: 'Muscles' | 'Body parts' | 'Equipment'
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 12)
 * @returns {Promise} Axios response with categories
 *
 * @example
 * const { data } = await getFilterCategories('Muscles', 1, 12);
 */
export function getFilterCategories(filter = 'Muscles', page = 1, limit = 12) {
  return api.get('/filters', { params: { filter, page, limit } });
}

// ============================================
// EXERCISES BY CATEGORY
// Used when clicking a category card
// ============================================

/**
 * Get exercises filtered by muscle
 * @param {string} muscle - Muscle name (e.g., 'lats', 'biceps')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export function getExercisesByMuscle(muscle, page = 1, limit = 10) {
  return api.get('/exercises', { params: { muscles: muscle, page, limit } });
}

/**
 * Get exercises filtered by body part
 * @param {string} bodypart - Body part name (e.g., 'back', 'chest')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export function getExercisesByBodyPart(bodypart, page = 1, limit = 10) {
  return api.get('/exercises', { params: { bodypart, page, limit } });
}

/**
 * Get exercises filtered by equipment
 * @param {string} equipment - Equipment name (e.g., 'barbell', 'dumbbell')
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export function getExercisesByEquipment(equipment, page = 1, limit = 10) {
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
 * @param {Object} options
 * @param {string} options.filter - Filter type: 'muscles' | 'bodypart' | 'equipment'
 * @param {string} options.category - Category value (e.g., 'lats', 'back', 'barbell')
 * @param {string} options.keyword - Search keyword in exercise name
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @returns {Promise} Axios response with exercises
 *
 * @example
 * // Search within muscles filter
 * searchExercises({ filter: 'muscles', category: 'lats', keyword: 'pull' });
 *
 * // Search within bodypart filter
 * searchExercises({ filter: 'bodypart', category: 'back', keyword: 'row' });
 *
 * // Search within equipment filter
 * searchExercises({ filter: 'equipment', category: 'barbell', keyword: 'press' });
 */
export function searchExercises({
  filter,
  category,
  keyword,
  page = 1,
  limit = 10,
} = {}) {
  const params = { page, limit };

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
 * @param {string} id - Exercise ID
 * @returns {Promise} Axios response with exercise details
 */
export function getExerciseById(id) {
  return api.get(`/exercises/${id}`);
}

// ============================================
// EXERCISE RATING (Optional feature)
// ============================================

/**
 * Add rating to an exercise
 * @param {string} id - Exercise ID
 * @param {Object} ratingData
 * @param {number} ratingData.rate - Rating value (1-5)
 * @param {string} ratingData.email - User email
 * @param {string} ratingData.review - Review text
 */
export function addExerciseRating(id, { rate, email, review }) {
  return api.patch(`/exercises/${id}/rating`, { rate, email, review });
}

// ============================================
// QUOTE OF THE DAY
// ============================================

/**
 * Get quote of the day
 * @returns {Promise} Axios response with quote
 */
export function getQuote() {
  return api.get('/quote');
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

/**
 * Subscribe to newsletter
 * @param {string} email - User email
 */
export function subscribe(email) {
  return api.post('/subscription', { email });
}
