import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/dashboard.tsx', [
    index('routes/home.tsx'),
    route('/:symbol', 'routes/ticker.tsx'),
  ]),

  route('actions/search-tickers', 'routes/actions/search-tickers.tsx'),
] satisfies RouteConfig;
