import { getQuote } from '../api';

export interface IQuote {
  quote: string;
  author: string;
}

interface IStoredQuote extends IQuote {
  date: string;
}

const QUOTE_KEY = 'dailyQuote';

// Local calendar date as YYYY-MM-DD (stable, timezone-local).
function getTodayDate(): string {
  return new Date().toLocaleDateString('en-CA');
}

function getSavedQuote(): IStoredQuote | null {
  const raw = localStorage.getItem(QUOTE_KEY);
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw) as IStoredQuote;
    if (stored.date !== getTodayDate()) {
      localStorage.removeItem(QUOTE_KEY); // stale -> drop it
      return null;
    }
    return stored;
  } catch {
    localStorage.removeItem(QUOTE_KEY); // corrupted -> drop it
    return null;
  }
}

function saveQuote(quote: IQuote): void {
  const toSave: IStoredQuote = { ...quote, date: getTodayDate() };
  localStorage.setItem(QUOTE_KEY, JSON.stringify(toSave));
}

/**
 * Today's quote: from cache if fresh, otherwise from the server.
 */
export async function getDailyQuote(): Promise<IQuote> {
  const saved = getSavedQuote();
  if (saved) return saved;

  const { data } = await getQuote(); // axios response: data = { quote, author }
  const quote: IQuote = { quote: data.quote, author: data.author };
  saveQuote(quote);
  return quote;
}
