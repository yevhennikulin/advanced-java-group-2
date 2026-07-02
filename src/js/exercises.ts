/**
  EXERCISES & CATEGORIES CONTROLLER
  =================================
*/

import { getFilterCategories } from './api';

document.addEventListener('DOMContentLoaded', () => {
  const categoriesGrid = document.getElementById('categories-grid');
  const fallbackBox = document.getElementById('exercises-fallback');
  const categoryTitle = document.getElementById('exercises-category-title');
  const titleDivider = document.getElementById('exercises-title-divider');
  const searchForm = document.getElementById('exercises-search-form');
  const gridContainer = document.getElementById('categories-container');
  const exercisesGridContainer = document.getElementById('exercises-grid-container');

  // Filter Buttons
  const tabButtons = document.querySelectorAll('.tabs-btn');

  let currentFilter = 'Muscles';
  let currentPage = 1;
  const limit = window.innerWidth >= 1440 ? 12 : 8;

  // Initialize
  loadCategories();

  // Bind Tab Click Handlers
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      if (target.classList.contains('active')) return;

      // Reset Active Tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      target.classList.add('active');

      // Update Filter State
      currentFilter = target.getAttribute('data-filter') || 'Muscles';
      currentPage = 1;

      // Reset Title Accents (return to categories view)
      if (categoryTitle) categoryTitle.classList.add('is-hidden');
      if (titleDivider) titleDivider.classList.add('is-hidden');
      if (gridContainer) gridContainer.classList.remove('is-hidden');
      if (exercisesGridContainer) exercisesGridContainer.classList.add('is-hidden');

      // Toggle Search Form based on filter
      if (searchForm) {
        if (currentFilter === 'Body parts') {
          searchForm.classList.remove('is-hidden');
        } else {
          searchForm.classList.add('is-hidden');
        }
      }

      loadCategories();
    });
  });

  // Load and Render Categories
  async function loadCategories() {
    if (!categoriesGrid) return;
    
    // Show Loading state
    categoriesGrid.innerHTML = '<div class="loader"></div>';
    if (fallbackBox) fallbackBox.classList.add('is-hidden');

    try {
      const response = await getFilterCategories(currentFilter, currentPage, limit);
      const { results, totalPages } = response.data;

      if (!results || results.length === 0) {
        categoriesGrid.innerHTML = '';
        if (fallbackBox) fallbackBox.classList.remove('is-hidden');
        return;
      }

      // Render Cards
      categoriesGrid.innerHTML = results.map((item: any) => `
        <li class="category-card" data-category="${item.name}" data-filter="${item.filter}">
          <img class="category-card-img" src="${item.imgURL}" alt="${item.name}" loading="lazy" />
          <div class="category-card-overlay"></div>
          <div class="category-card-content">
            <h3 class="category-card-name">${item.name}</h3>
            <p class="category-card-filter">${item.filter}</p>
          </div>
        </li>
      `).join('');

      // Bind Card Clicks
      bindCardClicks();

    } catch (error) {
      console.error('Error loading categories:', error);
      categoriesGrid.innerHTML = '';
      if (fallbackBox) fallbackBox.classList.remove('is-hidden');
    }
  }

  // Bind Clicks on Category Cards
  function bindCardClicks() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLLIElement;
        const category = target.getAttribute('data-category');
        
        // Hide Categories list and show Exercises layout mock container
        if (gridContainer) gridContainer.classList.add('is-hidden');
        if (exercisesGridContainer) exercisesGridContainer.classList.remove('is-hidden');
        
        // Update Section Title Header format: Exercises / [Category]
        if (categoryTitle && category) {
          categoryTitle.textContent = category;
          categoryTitle.classList.remove('is-hidden');
        }
        if (titleDivider) {
          titleDivider.classList.remove('is-hidden');
        }

        // Show Search input panel for exercises search
        if (searchForm) {
          searchForm.classList.remove('is-hidden');
        }
      });
    });
  }
});
