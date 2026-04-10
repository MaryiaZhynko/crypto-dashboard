import { TickersApiResponse, TickerApiResponse } from '~/schemas/tickers';

export const fetchTickers = async () => {
  try {
    const url = `${process.env.TICKER_API_URL}/tickers`;
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

  return [];
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
