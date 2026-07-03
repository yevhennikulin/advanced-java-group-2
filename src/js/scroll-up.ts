/*
  SCROLL UP BUTTON
  ================

  Shows button after user scrolls down past the Hero section.
  Smoothly scrolls back to top on click.
*/

const scrollUpBtn = document.getElementById('scroll-up');

if (scrollUpBtn) {
  const SHOW_AFTER_PX: number = 400;

  const toggleVisibility = (): void => {
    if (window.scrollY > SHOW_AFTER_PX) {
      scrollUpBtn.classList.add('scroll-up--visible');
    } else {
      scrollUpBtn.classList.remove('scroll-up--visible');
    }
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', toggleVisibility);
  scrollUpBtn.addEventListener('click', scrollToTop);

  toggleVisibility();
}
