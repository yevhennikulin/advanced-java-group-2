document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger-btn');
  const closeBtn = document.querySelector('.mobile-menu-close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('is-open');
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
    });
  }

  // Close menu when clicking mobile links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('is-open');
      }
    });
  });

  // Highlight active navigation links based on URL path
  const currentPath = window.location.pathname;
  const desktopLinks = document.querySelectorAll('.nav-link');

  function checkActive(link) {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if the current page matches the link destination
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
