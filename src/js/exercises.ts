import { getFilterCategories, searchExercises } from './api';
import { renderExercisesList } from './exercise-list';
import type { FilterType } from './types';

const FILTER_TO_PARAM: Record<FilterType, string> = {
  'Muscles': 'muscles',
  'Body parts': 'bodypart',
  'Equipment': 'equipment',
};

document.addEventListener('DOMContentLoaded', () => {
  const categoriesGrid = document.getElementById('categories-grid');
  const categoriesContainer = document.getElementById('categories-container');
  const exercisesGrid = document.getElementById('exercises-cards-grid');
  const exercisesGridContainer = document.getElementById('exercises-grid-container');
  const fallbackBox = document.getElementById('exercises-fallback');
  const categoryTitle = document.getElementById('exercises-category-title');
  const titleDivider = document.getElementById('exercises-title-divider');
  const searchForm = document.getElementById('exercises-search-form') as HTMLFormElement | null;
  const searchInput = document.getElementById('exercises-search-input') as HTMLInputElement | null;
  const paginationContainer = document.getElementById('pagination');
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tabs-btn');

  let currentFilter: FilterType = 'Muscles';
  let currentPage = 1;
  let currentCategory: string | null = null;
  let currentKeyword = '';

  const categoriesLimit = window.innerWidth >= 1440 ? 12 : 8;
  const exercisesLimit = window.innerWidth >= 1440 ? 10 : 8;

  loadCategories();

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = (btn.dataset.filter as FilterType) || 'Muscles';
      currentPage = 1;
      currentCategory = null;
      currentKeyword = '';

      if (searchInput) searchInput.value = '';
      showSearch(false);
      showCategoriesView();
      loadCategories();
    });
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentKeyword = searchInput?.value.trim() || '';
    currentPage = 1;
    loadExercises();
  });

  function showCategoriesView() {
    categoriesContainer?.classList.remove('is-hidden');
    exercisesGridContainer?.classList.add('is-hidden');
    categoryTitle?.classList.add('is-hidden');
    titleDivider?.classList.add('is-hidden');
  }

  function showExercisesView(category: string) {
    categoriesContainer?.classList.add('is-hidden');
    exercisesGridContainer?.classList.remove('is-hidden');

    if (categoryTitle) {
      categoryTitle.textContent = category;
      categoryTitle.classList.remove('is-hidden');
    }
    titleDivider?.classList.remove('is-hidden');
  }

  function showSearch(visible: boolean) {
    searchForm?.classList.toggle('is-hidden', !visible);
  }

  function renderPagination(page: number, totalPages: number) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.classList.add('is-hidden');
      paginationContainer.innerHTML = '';
      return;
    }

    paginationContainer.classList.remove('is-hidden');

    const MAX_VISIBLE = 7;
    let startPage: number;
    let endPage: number;

    if (totalPages <= MAX_VISIBLE) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const half = Math.floor(MAX_VISIBLE / 2);
      startPage = Math.max(1, page - half);
      endPage = startPage + MAX_VISIBLE - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - MAX_VISIBLE + 1;
      }
    }

    const icon = (id: string) =>
      `<svg class="pagination__icon" width="20" height="20"><use href="../../img/icons.svg#${id}" /></svg>`;

    const navLink = (iconId: string, targetPage: number, disabled: boolean) =>
      disabled
        ? `<li><span class="pagination__link pagination__nav disabled">${icon(iconId)}</span></li>`
        : `<li><a class="pagination__link pagination__nav" href="#" data-page="${targetPage}">${icon(iconId)}</a></li>`;

    let items = '';
    items += navLink('start', 1, page === 1);
    items += navLink('back', page - 1, page === 1);

    for (let p = startPage; p <= endPage; p++) {
      const isCurrent = p === page;
      items += isCurrent
        ? `<li><span class="pagination__link active" aria-current="page">${p}</span></li>`
        : `<li><a class="pagination__link" href="#" data-page="${p}">${p}</a></li>`;
    }

    items += navLink('next', page + 1, page === totalPages);
    items += navLink('end', totalPages, page === totalPages);

    paginationContainer.innerHTML = `<ul class="pagination__list">${items}</ul>`;
    paginationContainer.addEventListener('click', onPaginationClick);
  }

  function onPaginationClick(e: Event) {
    const target = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-page]');
    if (!target) return;

    e.preventDefault();

    const page = Number(target.dataset.page);
    if (page === currentPage) return;

    currentPage = page;

    if (currentCategory) {
      loadExercises();
    } else {
      loadCategories();
    }
  }

  async function loadCategories() {
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = '<div class="loader"></div>';
    fallbackBox?.classList.add('is-hidden');

    try {
      const { data } = await getFilterCategories(currentFilter, currentPage, categoriesLimit);
      const { results, totalPages } = data;

      if (!results.length) {
        categoriesGrid.innerHTML = '';
        fallbackBox?.classList.remove('is-hidden');
        renderPagination(currentPage, 0);
        return;
      }

      categoriesGrid.innerHTML = results.map(item => `
        <li class="category-card" data-category="${item.name}" data-filter="${item.filter}">
          <img class="category-card-img" src="${item.imgURL}" alt="${item.name}" loading="lazy" />
          <div class="category-card-overlay"></div>
          <div class="category-card-content">
            <h3 class="category-card-name">${item.name}</h3>
            <p class="category-card-filter">${item.filter}</p>
          </div>
        </li>
      `).join('');

      renderPagination(currentPage, totalPages);
      bindCardClicks();
    } catch (error) {
      console.error('Error loading categories:', error);
      categoriesGrid.innerHTML = '';
      fallbackBox?.classList.remove('is-hidden');
      renderPagination(currentPage, 0);
    }
  }

  function bindCardClicks() {
    const cards = document.querySelectorAll<HTMLLIElement>('.category-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        currentCategory = card.dataset.category || null;
        currentPage = 1;
        currentKeyword = '';

        if (searchInput) searchInput.value = '';
        if (currentCategory) {
          showExercisesView(currentCategory);
          showSearch(true);
          loadExercises();
        }
      });
    });
  }

  async function loadExercises() {
    if (!exercisesGrid || !currentCategory) return;

    exercisesGrid.innerHTML = '<div class="loader"></div>';
    fallbackBox?.classList.add('is-hidden');

    try {
      const filterParam = FILTER_TO_PARAM[currentFilter];
      const { data } = await searchExercises({
        filter: filterParam as 'muscles' | 'bodypart' | 'equipment',
        category: currentCategory,
        keyword: currentKeyword || undefined,
        page: currentPage,
        limit: exercisesLimit,
      });

      const { results, totalPages } = data;

      if (!results.length) {
        exercisesGrid.innerHTML = '';
        fallbackBox?.classList.remove('is-hidden');
        renderPagination(currentPage, 0);
        return;
      }

      exercisesGrid.innerHTML = renderExercisesList(results);
      renderPagination(currentPage, totalPages);
    } catch (error) {
      console.error('Error loading exercises:', error);
      exercisesGrid.innerHTML = '';
      fallbackBox?.classList.remove('is-hidden');
      renderPagination(currentPage, 0);
    }
  }
});
