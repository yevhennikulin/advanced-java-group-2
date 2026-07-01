/* QUOTE OF THE DAY (Home + Favorites). Fetch + cache live in services/quote-service.js.
 * DOM hooks: [data-quote-text] and [data-quote-author]
 */

import { getDailyQuote } from "./services/quote-service.js";

const FALLBACK_QUOTE = {
  quote: "The body achieves what the mind believes.",
  author: "Unknown",
};

function renderQuote({ quote, author }) {
  const textEl = document.querySelector("[data-quote-text]");
  const authorEl = document.querySelector("[data-quote-author]");
  if (!textEl || !authorEl) return;

  textEl.textContent = quote;
  authorEl.textContent = author;
}

export async function initQuote() {
  if (!document.querySelector("[data-quote-text]")) return;

  try {
    const quote = await getDailyQuote();
    renderQuote(quote);
  } catch {
    renderQuote(FALLBACK_QUOTE);
  }
}

initQuote();
