import { getDailyQuote, type IQuote } from './services/quote-service';

const FALLBACK_QUOTE: IQuote = {
  quote: 'The body achieves what the mind believes.',
  author: 'Unknown',
};

function renderQuote({ quote, author }: IQuote): void {
  const textEl = document.querySelector<HTMLElement>('[data-quote-text]');
  const authorEl = document.querySelector<HTMLElement>('[data-quote-author]');
  if (!textEl || !authorEl) return;

  textEl.textContent = quote;
  authorEl.textContent = author;
}

export async function initQuote(): Promise<void> {
  // No quote block on this page -> nothing to do.
  if (!document.querySelector('[data-quote-text]')) return;

  try {
    renderQuote(await getDailyQuote());
  } catch {
    renderQuote(FALLBACK_QUOTE);
  }
}

initQuote();
