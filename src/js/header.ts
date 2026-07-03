document.addEventListener('DOMContentLoaded', (): void => {
  const burgerBtn = document.querySelector<HTMLButtonElement>('.burger-btn');
  const closeBtn = document.querySelector<HTMLButtonElement>('.mobile-menu-close-btn');
  const mobileMenu = document.querySelector<HTMLElement>('.mobile-menu');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.mobile-nav-link');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', (): void => {
      mobileMenu.classList.add('is-open');
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', (): void => {
      mobileMenu.classList.remove('is-open');
    });
  }

  navLinks.forEach((link: HTMLAnchorElement): void => {
    link.addEventListener('click', (): void => {
      if (mobileMenu) {
        mobileMenu.classList.remove('is-open');
      }
    });
  });

  const currentPath: string = window.location.pathname;
  const desktopLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  function checkActive(link: HTMLAnchorElement): void {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const isHome = href.includes('index.html');
    const isFavorites = href.includes('favorites.html');
    
    if (isFavorites && currentPath.includes('favorites.html')) {
      link.classList.add('active');
    } else if (isHome && !currentPath.includes('favorites.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  }

  desktopLinks.forEach(checkActive);
  navLinks.forEach(checkActive);
});
