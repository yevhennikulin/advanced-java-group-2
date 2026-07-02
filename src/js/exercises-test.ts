/**
 * EXERCISES TEST SCRIPT
 * =====================
 * 
 * This script fetches data from all API endpoints and displays
 * the results in the exercises.html test page.
 */

import {
  getFilterCategories,
  getExercisesByMuscle,
  getExercisesByBodyPart,
  getExercisesByEquipment,
  searchExercises,
  getExerciseById,
  getQuote,
  subscribe,
} from './api';

// Helper to render data to an element
function renderOutput(elementId, data, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = JSON.stringify(data, null, 2);
  el.classList.toggle('error', isError);
  el.classList.toggle('success', !isError);
}

// Helper to handle API calls
async function fetchAndRender(elementId, apiCall) {
  try {
    const { data } = await apiCall();
    renderOutput(elementId, data);
    return data;
  } catch (error) {
    renderOutput(elementId, { error: error.message }, true);
    return null;
  }
}

// ============================================
// 1. FILTER CATEGORIES
// ============================================
async function loadFilterCategories() {
  await fetchAndRender('muscles-categories', () =>
    getFilterCategories('Muscles', 1, 12)
  );

  await fetchAndRender('bodyparts-categories', () =>
    getFilterCategories('Body parts', 1, 12)
  );

  await fetchAndRender('equipment-categories', () =>
    getFilterCategories('Equipment', 1, 12)
  );
}

// ============================================
// 2. EXERCISES BY CATEGORY
// ============================================
async function loadExercisesByCategory() {
  const muscleData = await fetchAndRender('exercises-by-muscle', () =>
    getExercisesByMuscle('lats', 1, 5)
  );

  await fetchAndRender('exercises-by-bodypart', () =>
    getExercisesByBodyPart('back', 1, 5)
  );

  await fetchAndRender('exercises-by-equipment', () =>
    getExercisesByEquipment('barbell', 1, 5)
  );

  return muscleData;
}

// ============================================
// 3. SEARCH EXERCISES
// ============================================
async function loadSearchResults() {
  await fetchAndRender('search-muscles', () =>
    searchExercises({
      filter: 'muscles',
      category: 'lats',
      keyword: 'pull',
      page: 1,
      limit: 5,
    })
  );

  await fetchAndRender('search-bodypart', () =>
    searchExercises({
      filter: 'bodypart',
      category: 'back',
      keyword: 'row',
      page: 1,
      limit: 5,
    })
  );

  await fetchAndRender('search-equipment', () =>
    searchExercises({
      filter: 'equipment',
      category: 'barbell',
      keyword: 'press',
      page: 1,
      limit: 5,
    })
  );
}

// ============================================
// 4. EXERCISE DETAILS
// ============================================
async function loadExerciseDetails(exercisesData) {
  if (exercisesData?.results?.length > 0) {
    const firstExerciseId = exercisesData.results[0]._id;
    await fetchAndRender('exercise-details', () =>
      getExerciseById(firstExerciseId)
    );
  } else {
    renderOutput(
      'exercise-details',
      { error: 'No exercise ID available from previous request' },
      true
    );
  }
}

// ============================================
// 5. QUOTE OF THE DAY
// ============================================
async function loadQuote() {
  await fetchAndRender('quote', getQuote);
}

// ============================================
// 6. SUBSCRIPTION FORM
// ============================================
function setupSubscriptionForm() {
  const form = document.getElementById('subscription-form');
  const resultEl = document.getElementById('subscription-result');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('subscription-email').value;
    resultEl.textContent = 'Sending...';
    resultEl.classList.remove('error', 'success');

    try {
      const { data } = await subscribe(email);
      renderOutput('subscription-result', data);
    } catch (error) {
      renderOutput(
        'subscription-result',
        { error: error.response?.data?.message || error.message },
        true
      );
    }
  });
}

// ============================================
// INIT - Run all tests
// ============================================
async function init() {
  console.log('Starting API tests...');

  // Load all data in parallel where possible
  const [, exercisesData] = await Promise.all([
    loadFilterCategories(),
    loadExercisesByCategory(),
  ]);

  // These depend on previous results or are independent
  await Promise.all([
    loadSearchResults(),
    loadExerciseDetails(exercisesData),
    loadQuote(),
  ]);

  // Setup form handler
  setupSubscriptionForm();

  console.log('API tests complete!');
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
