import { getQuote } from "../api.js";

const QUOTE_KEY = "dailyQuote";

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA");
}

function getSavedQuote() {
  const raw = localStorage.getItem(QUOTE_KEY);
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw);
    if (stored.date !== getTodayDate()) {
      localStorage.removeItem(QUOTE_KEY);
      return null;
    }
    return stored;
  } catch {
    localStorage.removeItem(QUOTE_KEY);
    return null;
  }
}

function saveQuote(quote) {
  const toSave = { ...quote, date: getTodayDate() };
  localStorage.setItem(QUOTE_KEY, JSON.stringify(toSave));
}

/**
 * Today's quote: from cache if fresh, otherwise from the server.
 * @returns {Promise<{ quote: string, author: string }>}
 */
export async function getDailyQuote() {
  const saved = getSavedQuote();
  if (saved) return saved;

  const { data } = await getQuote();
  const quote = { quote: data.quote, author: data.author };
  saveQuote(quote);
  return quote;
}
