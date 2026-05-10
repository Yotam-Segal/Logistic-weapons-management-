// * Generic GET wrapper over TanStack Query's `useQuery`.
// * All feature-level data hooks (e.g. useInventory, useIssues) compose this
// * so swapping the mock adapter for a real backend stays a one-file change.
import { useQuery, type QueryKey, type UseQueryResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { httpClient } from '../utils/httpClient';

export interface IGetRequestArgs {
  queryKey: QueryKey;
  url: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
}

export const useGetRequest = <TData>(args: IGetRequestArgs): UseQueryResult<TData, Error> => {
  const { queryKey, url, params, enabled = true } = args;

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async (): Promise<TData> => {
      const response: AxiosResponse<TData> = await httpClient.get<TData>(url, { params });
      return response.data;
    },
    enabled,
  });
};

export default useGetRequest;
