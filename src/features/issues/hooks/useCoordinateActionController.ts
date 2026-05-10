// * Controller hook for the CoordinateAction button (Req 7.2, 7.3, 7.4).
// *
// * Owns:
// *   - Calling `useCoordinateIssue` for the current issue.
// *   - Driving `NotificationBanner` visibility + copy on success/error.
// *   - Forwarding a successful coordination to the drawer via the optional
// *     `onCoordinated` callback so the parent can close itself.
// *
// * Why this lives in a hook:
// *   The CoordinateAction component stays thin — hook calls, derived values,
// *   and JSX only (per structure.md). Mutation + banner orchestration lives
// *   here, mirroring `useItemDrawerController` for consistency.
// *
// * Why no `useEffect`:
// *   Banner state is driven from the mutation's `onSuccess`/`onError`
// *   callbacks passed to `mutate(...)`. React Query fires those synchronously
// *   relative to the settled mutation, so observing `isSuccess`/`isError`
// *   through an effect is unnecessary.
import { useCallback, useState } from 'react';

import useCoordinateIssue from './useCoordinateIssue';
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

export interface IUseCoordinateActionControllerResult {
  trigger: () => void;
  isSubmitting: boolean;
  banner: IBannerState | null;
}

// * Hebrew feedback copy kept together for easy tweaking.
const SUCCESS_MESSAGE: string = 'התקלה תואמה בהצלחה';
const ERROR_MESSAGE: string = 'תיאום התקלה נכשל, נסה שוב';

export const useCoordinateActionController = (
  issue: IIssue,
  onCoordinated?: () => void,
): IUseCoordinateActionControllerResult => {
  const mutation = useCoordinateIssue();

  const [banner, setBanner] = useState<IBannerState | null>(null);

  const handleBannerClose = useCallback((): void => {
    setBanner((previous) => (previous === null ? previous : { ...previous, open: false }));
  }, []);

  const trigger = useCallback((): void => {
    mutation.mutate(
      { issueId: issue.id },
      {
        onSuccess: (): void => {
          setBanner({
            open: true,
            severity: 'success',
            message: SUCCESS_MESSAGE,
            onClose: handleBannerClose,
          });
          // * Req 7.4: let the drawer react (e.g. close itself). The mutation
          // * hook already invalidates `['issues', ...]`, so the list refreshes
          // * even without this callback.
          onCoordinated?.();
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
  }, [issue.id, mutation, onCoordinated, handleBannerClose]);

  return {
    trigger,
    isSubmitting: mutation.isLoading,
    banner,
  };
};

export default useCoordinateActionController;
