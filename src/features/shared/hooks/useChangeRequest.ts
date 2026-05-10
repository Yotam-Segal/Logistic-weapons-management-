// * Generic mutation wrapper over TanStack Query's `useMutation`.
// * Covers POST/PUT/PATCH/DELETE for all feature-level change hooks (e.g.
// * useReportIssue, useCoordinateIssue, useResolveIssue) so swapping the
// * mock adapter for a real backend stays a one-file change.
import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { httpClient } from '../utils/httpClient';

export type TChangeRequestMethod = 'post' | 'put' | 'patch' | 'delete';

export interface IChangeRequestArgs<TVariables> {
  url: string | ((variables: TVariables) => string);
  method: TChangeRequestMethod;
  onSuccessInvalidate?: QueryKey[];
}

// * Resolves the request URL, supporting both static strings and
// * variable-driven builders (e.g. `/issues/:id/coordinate`).
const resolveUrl = <TVariables>(
  url: string | ((variables: TVariables) => string),
  variables: TVariables,
): string => (typeof url === 'function' ? url(variables) : url);

// * Dispatches the correct axios verb. DELETE is split out because axios
// * types the signature without a body argument.
const sendRequest = async <TData, TVariables>(
  method: TChangeRequestMethod,
  url: string,
  variables: TVariables,
): Promise<TData> => {
  if (method === 'delete') {
    const response: AxiosResponse<TData> = await httpClient.delete<TData>(url);
    return response.data;
  }

  const response: AxiosResponse<TData> = await httpClient.request<TData>({
    url,
    method,
    data: variables,
  });
  return response.data;
};

export const useChangeRequest = <TData, TVariables = void>(
  args: IChangeRequestArgs<TVariables>,
): UseMutationResult<TData, Error, TVariables> => {
  const { url, method, onSuccessInvalidate } = args;
  const queryClient: QueryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const resolvedUrl: string = resolveUrl<TVariables>(url, variables);
      return sendRequest<TData, TVariables>(method, resolvedUrl, variables);
    },
    onSuccess: (): void => {
      if (!onSuccessInvalidate || onSuccessInvalidate.length === 0) {
        return;
      }

      onSuccessInvalidate.forEach((queryKey: QueryKey): void => {
        void queryClient.invalidateQueries({ queryKey });
      });
    },
  });
};

export default useChangeRequest;
