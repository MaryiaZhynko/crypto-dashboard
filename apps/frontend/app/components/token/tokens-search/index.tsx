import { SearchIcon } from 'lucide-react';
import { TokenSearchLink } from './link';
import { useTokenSearch } from './useTokenSearch';

export function TokenSearch() {
  const {
    rootRef,
    query,
    isDropdownOpen,
    isSearching,
    tickers,
    handleChange,
    handleResetState,
    handleFocusChange,
  } = useTokenSearch();

  return (
    <div>
      <div ref={rootRef} className="relative">
        <div className="flex items-center gap-2 px-6 border-border border bg-card py-4">
          <SearchIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search by name or symbol"
            value={query}
            onChange={handleChange}
            onFocus={() => handleFocusChange(true)}
            onBlur={() => handleFocusChange(false)}
          />
        </div>

        {isDropdownOpen && (
          <div
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
            onMouseDown={(e) => e.preventDefault()}
          >
            {isSearching && (
              <p className="px-3 py-2.5 text-sm text-muted-foreground">
                Searching…
              </p>
            )}

            {!isSearching && tickers.length === 0 && (
              <p className="px-3 py-2.5 text-sm text-muted-foreground">
                No tokens found
              </p>
            )}

            {!isSearching && tickers.length > 0 && (
              <ul className="py-1">
                {tickers.map((ticker) => (
                  <li key={ticker.symbol} role="option">
                    <TokenSearchLink
                      ticker={ticker}
                      handleResetState={handleResetState}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
