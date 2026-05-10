// * Issues fetch hook (Req 2.2, 2.4, 6.1, 8.1).
// * Wraps `useGetRequest` and forwards the selected location to the mock
// * GET /issues handler, which performs the actual filtering server-side.
import type { UseQueryResult } from '@tanstack/react-query';
import { useGetRequest } from '../../shared/hooks/useGetRequest';
import type { IIssue } from '../models/issue';

// * Named constants keep the query key prefix and endpoint URL in one place so
// * mutation hooks (report/coordinate/resolve) invalidate with the exact same key.
export const ISSUES_QUERY_KEY_PREFIX = 'issues';
export const ISSUES_URL = '/issues';

export const useIssues = (locationId: string | null): UseQueryResult<IIssue[], Error> => {
  return useGetRequest<IIssue[]>({
    queryKey: [ISSUES_QUERY_KEY_PREFIX, locationId],
    url: ISSUES_URL,
    params: { locationId },
    enabled: locationId !== null,
  });
};

export default useIssues;
