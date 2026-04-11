import { useState, useEffect, useRef, useMemo, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTickers } from '~/fetchers/tickers';

const SEARCH_DEBOUNCE_MS = 500;
const MAX_SEARCH_LEN = 64;
const SEARCH_LIMIT = 20;

export function useTokenSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  const searchForQuery = useMemo(() => {
    const query = debounced.trim();

    if (query.length === 0) return '';

    return query.length > MAX_SEARCH_LEN
      ? query.slice(0, MAX_SEARCH_LEN)
      : query;
  }, [debounced]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: ['tickers', 'search', searchForQuery],
    queryFn: () =>
      fetchTickers({ limit: SEARCH_LIMIT, offset: 0, search: searchForQuery }),
    enabled: searchForQuery.length > 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const isDropdownOpen = isOpen && debounced.length > 0;
  const isSearching = searchForQuery.length > 0 && (isPending || isFetching);
  const tickers = data?.items ?? [];

  const handleFocusChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResetState = () => {
    setIsOpen(false);
    setQuery('');
    setDebounced('');
  };

  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(query.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timer);
  }, [query]);

  return {
    debounced,
    rootRef,
    query,
    isDropdownOpen,
    isSearching,
    tickers,
    handleChange,
    handleResetState,
    handleFocusChange,
  };
}
