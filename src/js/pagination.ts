function icon(id: string): string {
  return `<svg class="pagination__icon" width="20" height="20"><use href="../../img/icons.svg#${id}" /></svg>`;
}

function navLink(
  iconId: string,
  targetPage: number,
  disabled: boolean,
): string {
  const label =
    iconId === "begin"
      ? "First page"
      : iconId === "back"
        ? "Previous page"
        : iconId === "next"
          ? "Next page"
          : iconId === "end"
            ? "Last page"
            : "Pagination";

  return disabled
    ? `<li><span class="pagination__link pagination__nav disabled" aria-disabled="true" aria-label="${label}">${icon(iconId)}</span></li>`
    : `<li><a class="pagination__link pagination__nav" href="#" data-page="${targetPage}" aria-label="${label}">${icon(iconId)}</a></li>`;
}

function pageLink(page: number, isCurrent: boolean): string {
  return isCurrent
    ? `<li><span class="pagination__link active" aria-current="page">${page}</span></li>`
    : `<li><a class="pagination__link" href="#" data-page="${page}">${page}</a></li>`;
}

function ellipsis(): string {
  return `<li><span class="pagination__link pagination__ellipsis">&hellip;</span></li>`;
}

function getPageItems(page: number, totalPages: number): string {
  if (totalPages <= 7) {
    let items = "";
    for (let p = 1; p <= totalPages; p++) {
      items += pageLink(p, p === page);
    }
    return items;
  }

  let items = "";

  items += pageLink(1, page === 1);

  if (page > 3) {
    items += ellipsis();
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let p = start; p <= end; p++) {
    items += pageLink(p, p === page);
  }

  if (page < totalPages - 2) {
    items += ellipsis();
  }

  items += pageLink(totalPages, page === totalPages);

  return items;
}

export function initPagination(
  container: HTMLElement,
  onPageChange: (page: number) => void,
): void {
  container.addEventListener("click", (e: Event) => {
    const target = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "[data-page]",
    );
    if (!target) return;

    e.preventDefault();
    onPageChange(Number(target.dataset.page));
  });
}

export function renderPagination(
  container: HTMLElement,
  page: number,
  totalPages: number,
): void {
  if (totalPages <= 1) {
    container.classList.add("is-hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("is-hidden");

  let items = "";
  items += navLink("begin", 1, page === 1);
  items += navLink("back", page - 1, page === 1);
  items += getPageItems(page, totalPages);
  items += navLink("next", page + 1, page === totalPages);
  items += navLink("end", totalPages, page === totalPages);

  container.innerHTML = `<ul class="pagination__list">${items}</ul>`;
}
