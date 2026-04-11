import { Object, Number, String, Array, type Static } from 'runtypes';

const PricePointObject = Object({
  timestamp: Number,
  price: Number,
});

export type PricePoint = Static<typeof PricePointObject>;

export const TickerPriceHistoryResponse = Array(PricePointObject);

export type TickerPriceHistoryPayload = Static<
  typeof TickerPriceHistoryResponse
>;

export const TickerObject = Object({
  symbol: String,
  name: String,
  logo: String,
  marketCap: Number,
  volume: Number,
  supply: Number,
  price: Number,
  history: Array(PricePointObject),
});

export type Ticker = Static<typeof TickerObject>;

export const TickersApiResponse = Object({
  items: Array(TickerObject),
  totalPages: Number,
});

export type TickersApiPayload = Static<typeof TickersApiResponse>;

export const TickerApiResponse = TickerObject;

export type TickerApiPayload = Static<typeof TickerApiResponse>;
