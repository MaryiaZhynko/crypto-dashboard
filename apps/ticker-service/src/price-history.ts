import type { IPricePoint } from '@shared/common/types/ticker';

const DEFAULT_DAYS = 7;

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
