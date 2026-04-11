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

const LIVE_CHART_POINT_COUNT = 50;
const LIVE_CHART_STEP_MS = 1000;
const LIVE_CHART_VOLATILITY = 0.12;

export type LiveFiveSecondSeries = {
  getPoints(): IPricePoint[];
  advance(): IPricePoint;
};

export function createLiveFiveSecondSeries(
  key: string,
  anchorPrice: number,
): LiveFiveSecondSeries {
  const randomPrice = generateRandomPrice(`${key}-5s`);
  const unscaled: number[] = [1];

  for (let i = 1; i < LIVE_CHART_POINT_COUNT; i++) {
    unscaled.push(
      unscaled[i - 1] * (1 + (randomPrice() - 0.48) * LIVE_CHART_VOLATILITY),
    );
  }

  const scale = anchorPrice / unscaled[unscaled.length - 1];
  const now = Date.now();

  let points: IPricePoint[] = unscaled.map((price, i) => ({
    timestamp: now - (LIVE_CHART_POINT_COUNT - 1 - i) * LIVE_CHART_STEP_MS,
    price: formatPrice(price * scale),
  }));
  let lastUnscaled = unscaled[unscaled.length - 1];

  return {
    getPoints(): IPricePoint[] {
      return points;
    },
    advance(): IPricePoint {
      lastUnscaled =
        lastUnscaled * (1 + (randomPrice() - 0.48) * LIVE_CHART_VOLATILITY);

      const price = formatPrice(lastUnscaled * scale);

      const lastTimestamp = points[points.length - 1].timestamp;
      const point: IPricePoint = {
        timestamp: lastTimestamp + LIVE_CHART_STEP_MS,
        price,
      };
      points = [...points.slice(1), point];

      return point;
    },
  };
}

export function buildFiveSecondPriceHistory(
  key: string,
  currentPrice: number,
): IPricePoint[] {
  return createLiveFiveSecondSeries(key, currentPrice).getPoints();
}
