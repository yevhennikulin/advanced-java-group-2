import { getFilterCategories, searchExercises } from "./api";
import { renderCategoryList, renderExercisesList } from "./exercise-list";
import { initPagination, renderPagination } from "./pagination";
import type { FilterType, PaginatedResponse } from "./types";

const FILTER_TO_PARAM: Record<
  FilterType,
  "muscles" | "bodypart" | "equipment"
> = {
  Muscles: "muscles",
  "Body parts": "bodypart",
  Equipment: "equipment",
};

const PARAM_TO_FILTER: Record<string, FilterType> = {
  muscles: "Muscles",
  bodypart: "Body parts",
  equipment: "Equipment",
};

interface State {
  filter: FilterType;
  page: number;
  category: string | null;
  keyword: string;
}

interface Elements {
  categoriesGrid: HTMLUListElement;
  categoriesContainer: HTMLElement;
  exercisesGrid: HTMLUListElement;
  exercisesGridContainer: HTMLElement;
  fallback: HTMLElement;
  categoryTitle: HTMLElement;
  titleDivider: HTMLElement;
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
  searchClear: HTMLElement;
  pagination: HTMLElement;
  tabButtons: NodeListOf<HTMLButtonElement>;
}

function getElements(): Elements | null {
  const el = (id: string) => document.getElementById(id);
  const categoriesGrid = el("categories-grid");
  const pagination = el("pagination");

  if (!categoriesGrid || !pagination) return null;

  return {
    categoriesGrid: categoriesGrid as HTMLUListElement,
    categoriesContainer: el("categories-container")!,
    exercisesGrid: el("exercises-cards-grid") as HTMLUListElement,
    exercisesGridContainer: el("exercises-grid-container")!,
    fallback: el("exercises-fallback")!,
    categoryTitle: el("exercises-category-title")!,
    titleDivider: el("exercises-title-divider")!,
    searchForm: el("exercises-search-form") as HTMLFormElement,
    searchInput: el("exercises-search-input") as HTMLInputElement,
    searchClear: el("exercises-search-clear")!,
    pagination: pagination,
    tabButtons: document.querySelectorAll<HTMLButtonElement>(".tabs-btn"),
  };
}

const CATEGORIES_LIMIT = window.innerWidth >= 1440 ? 12 : 8;
const EXERCISES_LIMIT = window.innerWidth >= 1440 ? 10 : 8;

function stateFromURL(): Partial<State> {
  const params = new URLSearchParams(window.location.search);
  const result: Partial<State> = {};

  const filter = params.get("filter");
  if (filter && filter in PARAM_TO_FILTER) {
    result.filter = PARAM_TO_FILTER[filter];
  }

  const page = params.get("page");
  if (page) {
    const parsed = Number(page);
    if (Number.isFinite(parsed)) result.page = Math.max(1, Math.trunc(parsed));
  }
  const category = params.get("category");
  if (category) result.category = category;

  const keyword = params.get("keyword");
  if (keyword) result.keyword = keyword;

  return result;
}

function syncURL(state: State) {
  const params = new URLSearchParams();
  params.set("filter", FILTER_TO_PARAM[state.filter]);

  if (state.page > 1) params.set("page", String(state.page));
  if (state.category) params.set("category", state.category);
  if (state.keyword) params.set("keyword", state.keyword);

  const url = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, "", url);
}

document.addEventListener("DOMContentLoaded", () => {
  const maybeEls = getElements();

  if (!maybeEls) return;

  const els: Elements = maybeEls;
  const urlState = stateFromURL();
  const state: State = {
    filter: urlState.filter || "Muscles",
    page: urlState.page || 1,
    category: urlState.category || null,
    keyword: urlState.keyword || "",
  };

  initPagination(els.pagination, onPageChange);
  initTabButtons();
  initSearchForm();
  initCategoryDelegation();
  initBackButton();

  setActiveTab(state.filter);
  if (state.category) {
    els.searchInput.value = state.keyword;
    showExercisesView(state.category);
    showSearch(true);
    loadExercises();
  } else {
    loadCategories();
  }

  window.addEventListener("popstate", () => {
    const restored = stateFromURL();
    state.filter = restored.filter || "Muscles";
    state.page = restored.page || 1;
    state.category = restored.category || null;
    state.keyword = restored.keyword || "";

    setActiveTab(state.filter);
    els.searchInput.value = state.keyword;

    if (state.category) {
      showExercisesView(state.category);
      showSearch(true);
      loadExercises();
    } else {
      showSearch(false);
      showCategoriesView();
      loadCategories();
    }
  });

  function initTabButtons() {
    els.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;

        state.filter = (btn.dataset.filter as FilterType) || "Muscles";
        state.page = 1;
        state.category = null;
        state.keyword = "";

        setActiveTab(state.filter);
        els.searchInput.value = "";
        showSearch(false);
        showCategoriesView();
        syncURL(state);
        loadCategories();
      });
    });
  }

  function setActiveTab(filter: FilterType) {
    els.tabButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
  }

  function initSearchForm() {
    els.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.keyword = els.searchInput.value.trim();
      state.page = 1;
      updateClearButton();
      syncURL(state);
      loadExercises();
    });

    els.searchInput.addEventListener("input", updateClearButton);

    els.searchClear.addEventListener("click", () => {
      els.searchInput.value = "";
      updateClearButton();

      if (state.keyword) {
        state.keyword = "";
        state.page = 1;
        syncURL(state);
        loadExercises();
      }
    });
  }

  function updateClearButton() {
    els.searchClear.classList.toggle(
      "is-hidden",
      !els.searchInput.value.trim(),
    );
  }

  function initCategoryDelegation() {
    els.categoriesGrid.addEventListener("click", (e) => {
      const card = (e.target as HTMLElement).closest<HTMLLIElement>(
        ".category-card",
      );
      if (!card) return;

      state.category = card.dataset.category || null;
      state.page = 1;
      state.keyword = "";
      els.searchInput.value = "";

      if (state.category) {
        showExercisesView(state.category);
        showSearch(true);
        syncURL(state);
        loadExercises();
      }
    });
  }

  function initBackButton() {
    document
      .querySelector(".exercises-title")
      ?.addEventListener("click", goBackToCategories);
    els.categoryTitle.addEventListener("click", goBackToCategories);
    els.titleDivider.addEventListener("click", goBackToCategories);
  }

  function goBackToCategories() {
    if (!state.category) return;

    state.category = null;
    state.page = 1;
    state.keyword = "";
    els.searchInput.value = "";

    showSearch(false);
    showCategoriesView();
    syncURL(state);
    loadCategories();
  }

  function onPageChange(page: number) {
    if (page === state.page) return;
    state.page = page;
    syncURL(state);

    if (state.category) {
      loadExercises();
    } else {
      loadCategories();
    }
  }

  function showCategoriesView() {
    els.categoriesContainer.classList.remove("is-hidden");
    els.exercisesGridContainer.classList.add("is-hidden");
    els.categoryTitle.classList.add("is-hidden");
    els.titleDivider.classList.add("is-hidden");
  }

  function showExercisesView(category: string) {
    els.categoriesContainer.classList.add("is-hidden");
    els.exercisesGridContainer.classList.remove("is-hidden");
    els.categoryTitle.textContent = category;
    els.categoryTitle.classList.remove("is-hidden");
    els.titleDivider.classList.remove("is-hidden");
  }

  function showSearch(visible: boolean) {
    els.searchForm.classList.toggle("is-hidden", !visible);
    if (visible) {
      updateClearButton();
    } else {
      els.searchClear.classList.add("is-hidden");
    }
  }

  async function loadContent<T>(
    container: HTMLElement,
    fetchFn: () => Promise<{ data: PaginatedResponse<T> }>,
    renderFn: (results: T[]) => string,
  ) {
    const currentHeight = container.offsetHeight;
    if (currentHeight > 0) {
      container.style.minHeight = `${currentHeight}px`;
    }

    container.innerHTML =
      '<li class="loader" role="status" aria-label="Loading"></li>';
    els.fallback.classList.add("is-hidden");

    try {
      const { data } = await fetchFn();
      const { results, totalPages } = data;

      if (!results.length) {
        container.innerHTML = "";
        container.style.minHeight = "";
        els.fallback.classList.remove("is-hidden");
        renderPagination(els.pagination, state.page, 0);
        return;
      }

      container.innerHTML = renderFn(results);
      container.style.minHeight = "";
      renderPagination(els.pagination, state.page, totalPages);
    } catch (error) {
      console.error("Error loading content:", error);
      container.innerHTML = "";
      container.style.minHeight = "";
      els.fallback.classList.remove("is-hidden");
      renderPagination(els.pagination, state.page, 0);
    }
  }

  function loadCategories() {
    return loadContent(
      els.categoriesGrid,
      () => getFilterCategories(state.filter, state.page, CATEGORIES_LIMIT),
      renderCategoryList,
    );
  }

  function loadExercises() {
    return loadContent(
      els.exercisesGrid,
      () =>
        searchExercises({
          filter: FILTER_TO_PARAM[state.filter],
          category: state.category!,
          keyword: state.keyword || undefined,
          page: state.page,
          limit: EXERCISES_LIMIT,
        }),
      renderExercisesList,
    );
  }
});
