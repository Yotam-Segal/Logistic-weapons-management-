// * Controller hook for the ResolveAction button (Req 9.2, 9.3, 9.4).
// *
// * Owns:
// *   - Calling `useResolveIssue` for the current issue.
// *   - Driving `NotificationBanner` visibility + copy on success/error.
// *   - Forwarding a successful resolution to the drawer via the optional
// *     `onResolved` callback so the parent can close itself.
// *
// * Why this lives in a hook:
// *   The ResolveAction component stays thin — hook calls, derived values,
// *   and JSX only (per structure.md). Mutation + banner orchestration lives
// *   here, mirroring `useCoordinateActionController` for consistency.
// *
// * Why no `useEffect`:
// *   Banner state is driven from the mutation's `onSuccess`/`onError`
// *   callbacks passed to `mutate(...)`. React Query fires those synchronously
// *   relative to the settled mutation, so observing `isSuccess`/`isError`
// *   through an effect is unnecessary.
import { useCallback, useState } from 'react';

import useResolveIssue from './useResolveIssue';
import type { IIssue } from '../models/issue';

// * Banner payload rendered directly by `NotificationBanner`. `null` means
// * "nothing to show" — the banner is not mounted in that case. We keep the
// * last content while the banner is closing so the Snackbar's exit
// * transition can still read `severity`/`message`.
export interface IBannerState {
  open: boolean;
  severity: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export interface IUseResolveActionControllerResult {
  submit: (comment?: string) => void;
  isSubmitting: boolean;
  banner: IBannerState | null;
}

// * Hebrew feedback copy kept together for easy tweaking.
const SUCCESS_MESSAGE: string = 'התקלה סומנה כטופלה';
const ERROR_MESSAGE: string = 'סימון התקלה כטופלה נכשל, נסה שוב';

export const useResolveActionController = (
  issue: IIssue,
  onResolved?: () => void,
): IUseResolveActionControllerResult => {
  const mutation = useResolveIssue();

  const [banner, setBanner] = useState<IBannerState | null>(null);

  const handleBannerClose = useCallback((): void => {
    setBanner((previous) => (previous === null ? previous : { ...previous, open: false }));
  }, []);

  const submit = useCallback(
    (comment?: string): void => {
      mutation.mutate(
        { issueId: issue.id, comment },
        {
          onSuccess: (): void => {
            setBanner({
              open: true,
              severity: 'success',
              message: SUCCESS_MESSAGE,
              onClose: handleBannerClose,
            });
            // * Req 9.4: let the drawer react (e.g. close itself). The
            // * mutation hook already invalidates `['issues', ...]`, so the
            // * list refreshes even without this callback.
            onResolved?.();
          },
          onError: (): void => {
            setBanner({
              open: true,
              severity: 'error',
              message: ERROR_MESSAGE,
              onClose: handleBannerClose,
            });
          },
        },
      );
    },
    [issue.id, mutation, onResolved, handleBannerClose],
  );

  return {
    submit,
    isSubmitting: mutation.isLoading,
    banner,
  };
};

export default useResolveActionController;
