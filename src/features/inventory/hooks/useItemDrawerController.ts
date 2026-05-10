// * Controller hook for the ItemDrawer (Req 5.1, 5.3, 5.5, 5.6).
// *
// * Owns:
// *   - The `useReportIssue` mutation call.
// *   - The notification banner visibility + content (success or error).
// *   - Wiring the mutation success path to close the drawer via `onClose()`.
// *
// * Why this lives in a hook:
// *   The ItemDrawer component itself should stay thin — hook calls, derived
// *   values, and JSX (per structure.md). Keeping mutation + banner
// *   orchestration here lets the component focus on layout.
// *
// * Why no `useEffect`:
// *   We drive banner state from the mutation's onSuccess/onError callbacks
// *   passed to `mutate(payload, { onSuccess, onError })`. React Query runs
// *   those synchronously relative to the settled mutation, so we never need
// *   to observe `isSuccess`/`isError` via an effect.
import { useCallback, useState } from 'react';

import useReportIssue from './useReportIssue';
import type { IInventoryItem } from '../models/inventoryItem';
import type { IReportIssueInput, TIssueType } from '../../issues/models/issue';

// * Shape passed in from `ReportIssueForm.onSubmit`. We accept the form
// * values and stitch in `itemId`/`locationId` at call time so the form
// * stays decoupled from the active item (Req 5.3).
export interface IReportIssueFormValues {
  issueType: TIssueType;
  comment?: string;
}

// * Banner state rendered directly by `NotificationBanner`. `null` means
// * "nothing to show"; the banner is unmounted/closed in that case.
export interface IItemDrawerBannerState {
  open: boolean;
  severity: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export interface IUseItemDrawerControllerResult {
  submit: (values: IReportIssueFormValues) => void;
  isSubmitting: boolean;
  banner: IItemDrawerBannerState | null;
}

// * Hebrew feedback copy kept together for easy tweaking.
const SUCCESS_MESSAGE: string = 'התקלה דווחה בהצלחה';
const ERROR_MESSAGE: string = 'שליחת הדיווח נכשלה, נסה שוב';

export const useItemDrawerController = (
  item: IInventoryItem | null,
  onClose: () => void,
): IUseItemDrawerControllerResult => {
  const mutation = useReportIssue();

  // * Banner content + visibility. We keep the last shown content alive
  // * while the banner is closing so the Snackbar's exit transition can
  // * still read `severity`/`message` without flashing to empty state.
  const [banner, setBanner] = useState<IItemDrawerBannerState | null>(null);

  const handleBannerClose = useCallback((): void => {
    setBanner((previous) => (previous === null ? previous : { ...previous, open: false }));
  }, []);

  const submit = useCallback(
    (values: IReportIssueFormValues): void => {
      // * No active item means the drawer is closed; submissions in that
      // * state would be a logic error upstream. Guard defensively so the
      // * hook stays a no-op when `item` is null.
      if (item === null) {
        return;
      }

      const payload: IReportIssueInput = {
        itemId: item.id,
        locationId: item.locationId,
        issueType: values.issueType,
        comment: values.comment,
      };

      mutation.mutate(payload, {
        onSuccess: (): void => {
          setBanner({
            open: true,
            severity: 'success',
            message: SUCCESS_MESSAGE,
            onClose: handleBannerClose,
          });
          // * Req 5.5: close the drawer on successful issue creation.
          onClose();
        },
        onError: (): void => {
          setBanner({
            open: true,
            severity: 'error',
            message: ERROR_MESSAGE,
            onClose: handleBannerClose,
          });
        },
      });
    },
    [item, mutation, onClose, handleBannerClose],
  );

  return {
    submit,
    isSubmitting: mutation.isLoading,
    banner,
  };
};

export default useItemDrawerController;
