export interface IPricePoint {
  timestamp: number;
  price: number;
}

export interface ITickerAsset {
  symbol: string;
  name: string;
  logo: string;
  marketCap: number;
  volume: number;
  supply: number;
  price: number;
  history: IPricePoint[];
}
