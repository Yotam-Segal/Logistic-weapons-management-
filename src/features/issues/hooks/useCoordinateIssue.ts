// * Coordinate-issue mutation hook (Req 7.3, 7.4).
// * Wraps the generic `useChangeRequest` and PATCHes the issue's `/coordinate`
// * endpoint. The mock server adapter is responsible for flipping the issue's
// * status to `"תיקון תואם"` — the hook itself just triggers the call and
// * invalidates the cached issues lists so any open IssuesPage refetches.
import type { UseMutationResult } from '@tanstack/react-query';

import useChangeRequest from '../../shared/hooks/useChangeRequest';
import type { IIssue } from '../models/issue';
import { ISSUES_QUERY_KEY_PREFIX } from './useIssues';

interface ICoordinateIssueVariables {
  issueId: string;
}

// * `locationId` is not part of the mutation variables, so invalidation goes
// * through the shared prefix. React Query matches query keys by prefix, so
// * every `['issues', <locationId>]` query (Req 6.1, 8.1) is refetched.
// * The generic `useChangeRequest` sends the full variables object as the
// * request body. The coordinate endpoint ignores the body, so passing
// * `{ issueId }` along is harmless.
export const useCoordinateIssue = (): UseMutationResult<
  IIssue,
  Error,
  ICoordinateIssueVariables
> => {
  return useChangeRequest<IIssue, ICoordinateIssueVariables>({
    url: (variables: ICoordinateIssueVariables): string =>
      `/issues/${variables.issueId}/coordinate`,
    method: 'patch',
    onSuccessInvalidate: [[ISSUES_QUERY_KEY_PREFIX]],
  });
};

export default useCoordinateIssue;
