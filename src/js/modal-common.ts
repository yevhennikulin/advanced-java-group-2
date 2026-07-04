/*
  COMMON MODAL CONTROLLER
  =======================

  Shared show/hide behavior for the `.modal` / `.modal__backdrop` / `.modal__close`
  pattern (see src/css/modals.css): toggling `is-hidden` + `aria-hidden`, locking
  body scroll, and binding/unbinding backdrop click, close button click and ESC.

  Used by both src/js/modal.ts (exercise modal) and src/js/rating-modal.ts
  (rating modal) so the open/close wiring isn't duplicated per modal.
*/

export interface ModalController {
  show(onClose?: () => void): void;
  hide(): void;
}

export function createModalController(modal: HTMLElement): ModalController {
  const backdrop = modal.querySelector<HTMLElement>('[data-modal-backdrop]')!;
  const closeBtn = modal.querySelector<HTMLElement>('[data-modal-close]')!;

  let handleKeydown: ((event: KeyboardEvent) => void) | null = null;
  let onCloseCallback: (() => void) | null = null;

  function hide(): void {
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    backdrop.removeEventListener('click', hide);
    closeBtn.removeEventListener('click', hide);
    if (handleKeydown) {
      document.removeEventListener('keydown', handleKeydown);
      handleKeydown = null;
    }

    const onClose = onCloseCallback;
    onCloseCallback = null;
    if (onClose) onClose();
  }

  function show(onClose?: () => void): void {
    onCloseCallback = onClose ?? null;

    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    handleKeydown = event => {
      if (event.key === 'Escape') hide();
    };

    backdrop.addEventListener('click', hide);
    closeBtn.addEventListener('click', hide);
    document.addEventListener('keydown', handleKeydown);

    closeBtn.focus({ preventScroll: true });
  }

  return { show, hide };
}
