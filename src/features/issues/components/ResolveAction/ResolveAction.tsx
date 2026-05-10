import { useState } from 'react';
import { Button, TextField } from '@mui/material';

import NotificationBanner from '../../../shared/components/NotificationBanner/NotificationBanner';
import useResolveActionController from '../../hooks/useResolveActionController';
import type { IIssue } from '../../models/issue';

import styles from './resolveAction.module.scss';

// * Props for the ResolveAction control.
// * `onResolved` lets the drawer react (e.g. close itself) on success.
// * Optional — parents that only care about query invalidation can omit it
// * and the mutation's built-in invalidation will still refresh the list
// * (Req 9.4).
interface IResolveActionProps {
    issue: IIssue;
    onResolved?: () => void;
}

// * Hebrew copy per Req 9.2 — optional comment label and "Mark Resolved"
// * button label. Centralized so tweaks stay in one place.
const COMMENT_LABEL: string = 'הערה (אופציונלי)';
const BUTTON_LABEL: string = 'סמן כטופל';

// * Control mounted inside the IssueDrawer for the Technician resolve flow
// * (Req 9.2, 9.3, 9.4).
// *
// * Behavior:
// *   - Renders an optional multiline comment field and a "Mark Resolved"
// *     button.
// *   - Clicking the button triggers `useResolveIssue` via the controller
// *     hook, passing the trimmed comment (or `undefined` if empty). The
// *     mock server adapter flips the issue's status to `"תקלה טופלה"` and
// *     persists the comment.
// *   - On success, a `NotificationBanner` is shown and the optional
// *     `onResolved` callback fires so the drawer can close itself.
// *   - On failure, an error banner is shown and the drawer stays open.
// *
// * Mounting rules live in `IssueDrawer` (Task 10.13): this component is
// * only rendered when the role is `technician`.
// *
// * Why the banner sits outside the form container:
// *   MUI's Snackbar is fixed-position, so placing it at the component root
// *   keeps it visible even if a parent unmounts the form after success.
const ResolveAction = ({ issue, onResolved }: IResolveActionProps): JSX.Element => {
    const { submit, isSubmitting, banner } = useResolveActionController(issue, onResolved);

    const [comment, setComment] = useState<string>('');

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        setComment(event.target.value);
    };

    const handleSubmit = (): void => {
        const trimmed: string = comment.trim();
        submit(trimmed === '' ? undefined : trimmed);
    };

    return (
        <>
            <div className={styles.root}>
                <TextField
                    className={styles.field}
                    label={COMMENT_LABEL}
                    value={comment}
                    onChange={handleCommentChange}
                    multiline
                    minRows={3}
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                />

                <Button
                    className={styles.button}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
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

export default ResolveAction;
