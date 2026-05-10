import { Button } from '@mui/material';

import NotificationBanner from '../../../shared/components/NotificationBanner/NotificationBanner';
import useCoordinateActionController from '../../hooks/useCoordinateActionController';
import type { IIssue } from '../../models/issue';

import styles from './coordinateAction.module.scss';

// * Props for the CoordinateAction control.
// * `onCoordinated` lets the drawer react (e.g. close itself) on success.
// * Optional — parents that only care about query invalidation can omit it
// * and the mutation's built-in invalidation will still refresh the list
// * (Req 7.4).
interface ICoordinateActionProps {
    issue: IIssue;
    onCoordinated?: () => void;
}

// * Button label (Hebrew) per Req 7.2 — "Coordinate Technician".
const BUTTON_LABEL: string = 'תיאם טכנאי';

// * Button mounted inside the IssueDrawer for the Rabashatz coordination flow
// * (Req 7.2, 7.3, 7.4).
// *
// * Behavior:
// *   - Clicking the button triggers `useCoordinateIssue` via the controller
// *     hook, which PATCHes the issue and (on the mock server) flips its
// *     status to `"תיקון תואם"`.
// *   - On success, a `NotificationBanner` is shown and the optional
// *     `onCoordinated` callback fires so the drawer can close itself.
// *   - On failure, an error banner is shown and the drawer stays open.
// *
// * Mounting rules live in `IssueDrawer` (Task 10.13): this component is
// * only rendered when the role is `rabashatz` and the issue's status is
// * `"תקלה מחכה לתיאום"`.
// *
// * Why the banner sits outside the button container:
// *   MUI's Snackbar is fixed-position, so placing it at the component root
// *   keeps it visible even if a parent unmounts the button after success.
const CoordinateAction = ({ issue, onCoordinated }: ICoordinateActionProps): JSX.Element => {
    const { trigger, isSubmitting, banner } = useCoordinateActionController(
        issue,
        onCoordinated,
    );

    return (
        <>
            <div className={styles.root}>
                <Button
                    className={styles.button}
                    variant="contained"
                    color="primary"
                    onClick={trigger}
                    disabled={isSubmitting}
                >
                    {BUTTON_LABEL}
                </Button>
            </div>

            {banner !== null && (
                <NotificationBanner
                    open={banner.open}
                    severity={banner.severity}
                    message={banner.message}
                    onClose={banner.onClose}
                />
            )}
        </>
    );
};

export default CoordinateAction;
