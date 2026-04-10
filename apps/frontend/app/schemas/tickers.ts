import { Object, Number, String, Array, type Static } from 'runtypes';

const PricePoint = Object({
  timestamp: Number,
  price: Number,
});

export type PricePoint = Static<typeof PricePoint>;

export const Ticker = Object({
  symbol: String,
  name: String,
  logo: String,
  marketCap: Number,
  volume: Number,
  supply: Number,
  price: Number,
  history: Array(PricePoint),
});

export type Ticker = Static<typeof Ticker>;

export const TickersApiResponse = Object({
  items: Array(Ticker),
  totalPages: Number,
});

export type TickersApiPayload = Static<typeof TickersApiResponse>;

export const TickerApiResponse = Ticker;

export type TickerApiPayload = Static<typeof TickerApiResponse>;
