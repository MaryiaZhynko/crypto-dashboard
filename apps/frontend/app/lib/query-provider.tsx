import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';

import { makeQueryClient } from './query-client';

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient: QueryClient = useMemo(() => makeQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
