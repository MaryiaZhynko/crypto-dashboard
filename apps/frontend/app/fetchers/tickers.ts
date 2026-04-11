import {
  TickersApiResponse,
  TickerApiResponse,
  type TickersApiPayload,
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

export const fetchTicker = async (symbol: string) => {
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
