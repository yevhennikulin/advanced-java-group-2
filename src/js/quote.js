import { getQuote } from "./api.js";

const QUOTE_STORAGE_KEY = "quote-of-the-day";

/**
 * Read today's quote: from cache if it is from today, otherwise from the server.
 * @returns {Promise<{ quote: string, author: string, date: string }>}
 */
async function getDailyQuote() {
  const today = new Date().toDateString();

  const cachedRaw = localStorage.getItem(QUOTE_STORAGE_KEY);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      if (cached.date === today) {
        return cached;
      }
    } catch {}
  }

  const { data } = await getQuote();
  const fresh = { quote: data.quote, author: data.author, date: today };
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

async function initQuote() {
  const textEl = document.querySelector("[data-quote-text]");
  const authorEl = document.querySelector("[data-quote-author]");

  if (!textEl || !authorEl) return;

  try {
    const { quote, author } = await getDailyQuote();
    textEl.textContent = quote;
    authorEl.textContent = author;
  } catch {
    const stale = localStorage.getItem(QUOTE_STORAGE_KEY);
    if (stale) {
      try {
        const { quote, author } = JSON.parse(stale);
        textEl.textContent = quote;
        authorEl.textContent = author;
        return;
      } catch {}
    }
    textEl.textContent =
      "Could not load the quote of the day. Please try again later.";
    authorEl.textContent = "";
  }
}

initQuote();

export { getDailyQuote, initQuote };
