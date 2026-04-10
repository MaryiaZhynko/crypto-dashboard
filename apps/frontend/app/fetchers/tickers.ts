import {
  TickersApiResponse,
  TickerApiResponse,
  type TickersApiPayload,
} from '~/schemas/tickers';

const emptyTickersResponse = (): TickersApiPayload => ({
  items: [],
  totalPages: 1,
});

export const fetchTickers = async (params?: {
  limit?: number;
  offset?: number;
}) => {
  try {
    const search = new URLSearchParams();

    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.offset != null) search.set('offset', String(params.offset));

    const qs = search.toString();

    const url = `${process.env.TICKER_API_URL}/tickers${qs ? `?${qs}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Tickers request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: unknown = await response.json();
    return TickersApiResponse.check(data);
  } catch (error) {
    console.error('Error fetching tickers:', error);
  }

  return emptyTickersResponse();
};

export const fetchTicker = async (symbol: string) => {
  try {
    const url = `${process.env.TICKER_API_URL}/tickers/${symbol}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Ticker request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: unknown = await response.json();
    return TickerApiResponse.check(data);
  } catch (error) {
    console.error('Error fetching ticker:', error);
  }

  return null;
};
