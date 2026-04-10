import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router';

export function usePageToGo() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return useMemo(
    () => (page: number) => {
      const params = new URLSearchParams(searchParams);

      if (page <= 1) params.delete('page');
      else params.set('page', String(page));

      const query = params.toString();

      return {
        pathname: location.pathname,
        search: query ? `?${query}` : '',
      };
    },
    [location.pathname, searchParams],
  );
}
