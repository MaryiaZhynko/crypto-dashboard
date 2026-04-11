import type { IPricePoint } from '@shared/common/types/ticker';

const DEFAULT_DAYS = 50;

function generateRandomPrice(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 7;
    h ^= h << 17;
    return (h >>> 0) / 4294967296;
  };
}

function formatPrice(p: number): number {
  if (p >= 1) {
    return Math.round(p * 100) / 100;
  }

  if (p >= 0.01) {
    return Math.round(p * 10000) / 10000;
  }

  return Math.round(p * 1e8) / 1e8;
}

export function buildPriceHistory(
  key: string,
  currentPrice: number,
  days = DEFAULT_DAYS,
): IPricePoint[] {
  const rand = generateRandomPrice(key);

  const raw: number[] = [1];

  for (let i = 1; i < days; i++) {
    raw.push(raw[i - 1] * (1 + (rand() - 0.48) * 0.045));
  }

  const scale = currentPrice / raw[raw.length - 1];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000; // 86_400_000;

  return raw.map((r, i) => ({
    timestamp: now - (days - 1 - i) * dayMs,
    price: formatPrice(r * scale),
  }));
}

const FIVE_SECOND_POINT_COUNT = 50;
const FIVE_SECOND_STEP_MS = 5000;
const FIVE_SECOND_VOLATILITY = 0.12;

export function buildFiveSecondPriceHistory(
  key: string,
  currentPrice: number,
): IPricePoint[] {
  const randomPrice = generateRandomPrice(`${key}-5s`);
  const history: number[] = [1];

  for (let i = 1; i < FIVE_SECOND_POINT_COUNT; i++) {
    history.push(
      history[i - 1] * (1 + (randomPrice() - 0.48) * FIVE_SECOND_VOLATILITY),
    );
  }

  const scale = currentPrice / history[history.length - 1];
  const now = Date.now();

  return history.map((price, i) => ({
    timestamp: now - (FIVE_SECOND_POINT_COUNT - 1 - i) * FIVE_SECOND_STEP_MS,
    price: formatPrice(price * scale),
  }));
}
