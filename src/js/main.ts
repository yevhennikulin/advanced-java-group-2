import { removeFavorite } from './services/favorites-service';
import { showConfirmModal } from './confirm-modal';
import './header';
import './footer';
import './exercises';
import './quote';
import './modal';
import './favorites';
import './scroll-up';

const actions: Record<string, (el: HTMLElement) => void> = {
  removeFavorite: (el) => {
    const id = el.dataset.exerciseId;
    if (!id) return;

    showConfirmModal({
      title: 'Remove favorite?',
      text: 'Are you sure you want to remove this exercise from your favorites?',
      confirmLabel: 'Remove',
      onConfirm: () => removeFavorite(id),
    });
  },
};

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!el) return;

  const handler = actions[el.dataset.action!];
  if (handler) {
    e.stopPropagation();
    handler(el);
  }
});
