import { fetchTickers } from '~/fetchers/tickers';
import type { Route } from './+types/search-tickers';

const MAX_SEARCH_LEN = 64;
const SEARCH_LIMIT = 20;

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    throw new Response(null, { status: 405 });
  }

  const formData = await request.formData();
  const searchField = formData.get('search');
  const raw = typeof searchField === 'string' ? searchField.trim() : '';

  if (raw.length === 0) {
    return Response.json({ search: '', items: [] });
  }

  const search =
    raw.length > MAX_SEARCH_LEN ? raw.slice(0, MAX_SEARCH_LEN) : raw;

  const { items } = await fetchTickers({
    limit: SEARCH_LIMIT,
    offset: 0,
    search,
  });

  return Response.json({ search: search, items });
}
