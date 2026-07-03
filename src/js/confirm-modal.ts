interface ConfirmOptions {
  title: string;
  text: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

function renderTemplate(title: string, text: string, confirmLabel: string): string {
  return `
    <div class="modal__backdrop" data-confirm-backdrop></div>
    <div class="confirm-modal__content" role="dialog" aria-modal="true">
      <button class="modal__close" type="button" data-confirm-close aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <h3 class="confirm-modal__title">${title}</h3>
      <p class="confirm-modal__text">${text}</p>
      <div class="confirm-modal__actions">
        <button class="confirm-modal__btn confirm-modal__btn--cancel" type="button" data-confirm-close>Cancel</button>
        <button class="confirm-modal__btn confirm-modal__btn--confirm" type="button" data-confirm-ok>${confirmLabel}</button>
      </div>
    </div>`;
}

let modal: HTMLDivElement | null = null;

function getModal(): HTMLDivElement {
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal confirm-modal is-hidden';
    modal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modal);
  }
  return modal;
}

export function showConfirmModal({ title, text, confirmLabel = 'Confirm', onConfirm }: ConfirmOptions): void {
  const el = getModal();
  el.innerHTML = renderTemplate(title, text, confirmLabel);

  el.classList.remove('is-hidden');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const confirmBtn = el.querySelector<HTMLButtonElement>('[data-confirm-ok]')!;

  function close() {
    el.classList.add('is-hidden');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    el.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeydown);
  }

  function onClick(e: Event) {
    const target = e.target as HTMLElement;
    if (target.closest('[data-confirm-ok]')) {
      onConfirm();
      close();
    } else if (target.closest('[data-confirm-close]') || target.matches('[data-confirm-backdrop]')) {
      close();
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  el.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
  confirmBtn.focus({ preventScroll: true });
}
