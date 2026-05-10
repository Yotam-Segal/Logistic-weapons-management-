import { QueryClient } from '@tanstack/react-query';

// * Shared QueryClient instance used across the application
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});
