// * Report-issue mutation hook (Req 5.3).
// * Wraps the generic `useChangeRequest` with the `/issues` endpoint and invalidates
// * the cached issues lists so any open IssuesPage refetches after a new issue is
// * reported. The mock server adapter is responsible for stamping the new issue
// * with `status = "תקלה מחכה לתיאום"` on creation.
import type { UseMutationResult } from '@tanstack/react-query';

import useChangeRequest from '../../shared/hooks/useChangeRequest';
import type { IIssue, IReportIssueInput } from '../../issues/models/issue';
import { ISSUES_QUERY_KEY_PREFIX } from '../../issues/hooks/useIssues';

// * `locationId` is part of the mutation variables rather than closed over by
// * the hook, so instead of narrowing to `['issues', locationId]` we invalidate
// * by the shared prefix. React Query matches query keys by prefix, so every
// * `['issues', <locationId>]` query (Req 6.1, 8.1) is refetched after success.
export const useReportIssue = (): UseMutationResult<IIssue, Error, IReportIssueInput> => {
  return useChangeRequest<IIssue, IReportIssueInput>({
    url: '/issues',
    method: 'post',
    onSuccessInvalidate: [[ISSUES_QUERY_KEY_PREFIX]],
  });
};

export default useReportIssue;
