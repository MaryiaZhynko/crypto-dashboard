import {
  TickersApiResponse,
  TickerApiResponse,
  TickerPriceHistoryResponse,
  type TickersApiPayload,
  type Ticker,
} from '~/schemas/tickers';
import { getTickerApiBaseUrl } from '~/lib/ticker-api';

const emptyTickersResponse = (): TickersApiPayload => ({
  items: [],
  totalPages: 1,
});

interface IParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const fetchTickers = async (params?: IParams) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.search && params.search.trim() !== '')
      searchParams.set('search', params.search.trim());

    const query = searchParams.toString();

    const baseUrl = getTickerApiBaseUrl();
    const url = `${baseUrl}/tickers${query ? `?${query}` : ''}`;

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

export const fetchTicker = async (symbol: string): Promise<Ticker | null> => {
  try {
    const url = `${getTickerApiBaseUrl()}/tickers/${symbol}`;

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

export const fetchTickerPriceHistory = async (symbol: string) => {
  try {
    const encoded = encodeURIComponent(symbol);
    const url = `${getTickerApiBaseUrl()}/tickers/${encoded}/history`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Ticker price history request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: unknown = await response.json();

    return TickerPriceHistoryResponse.check(data);
  } catch (error) {
    console.error('Error fetching ticker price history:', error);
  }

  return null;
};
