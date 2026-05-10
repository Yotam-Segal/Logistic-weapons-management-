// * Resolve-issue mutation hook (Req 9.3, 9.4).
// * Wraps the generic `useChangeRequest` and PATCHes the issue's `/resolve`
// * endpoint. The mock server adapter flips the issue's status to
// * `"תקלה טופלה"` and persists the provided comment; the hook triggers the
// * call and invalidates cached issues lists so any open IssuesPage refetches.
import type { UseMutationResult } from '@tanstack/react-query';

import useChangeRequest from '../../shared/hooks/useChangeRequest';
import type { IIssue } from '../models/issue';
import { ISSUES_QUERY_KEY_PREFIX } from './useIssues';

interface IResolveIssueVariables {
  issueId: string;
  comment?: string;
}

// * `locationId` is not part of the mutation variables, so invalidation goes
// * through the shared prefix. React Query matches query keys by prefix, so
// * every `['issues', <locationId>]` query (Req 6.1, 8.1) is refetched.
// * The generic `useChangeRequest` sends the full variables object as the
// * request body. The resolve endpoint only reads `comment`, so the extra
// * `issueId` in the body is ignored server-side.
export const useResolveIssue = (): UseMutationResult<IIssue, Error, IResolveIssueVariables> => {
  return useChangeRequest<IIssue, IResolveIssueVariables>({
    url: (variables: IResolveIssueVariables): string => `/issues/${variables.issueId}/resolve`,
    method: 'patch',
    onSuccessInvalidate: [[ISSUES_QUERY_KEY_PREFIX]],
  });
};

export default useResolveIssue;
