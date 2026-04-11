import {
  useState,
  useEffect,
  useRef,
  useActionState,
  type ChangeEvent,
} from 'react';
import type { Ticker } from '~/schemas/tickers';

const SEARCH_DEBOUNCE_MS = 500;

type SearchTickersResult = {
  search: string;
  items: Ticker[];
};

async function postSearch(
  _prev: SearchTickersResult | null,
  formData: FormData,
): Promise<SearchTickersResult> {
  const res = await fetch('/actions/search-tickers', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    return { search: '', items: [] };
  }

  return (await res.json()) as SearchTickersResult;
}

export function useTokenSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [state, formAction, isPending] = useActionState(postSearch, null);

  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isDropdownOpen = isOpen && debounced.length > 0;
  const isStale = state != null && state.search !== debounced;
  const isSearching = debounced.length > 0 && (isPending || isStale);
  const tickers =
    state != null && state.search === debounced ? state.items : [];

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
    const t = setTimeout(() => setDebounced(query.trim()), SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debounced.length === 0) {
      return;
    }

    formRef.current?.requestSubmit();
  }, [debounced]);

  return {
    formAction,
    formRef,
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
