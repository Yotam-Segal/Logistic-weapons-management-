import { Alert, Snackbar } from '@mui/material';

import styles from './notificationBanner.module.scss';

// * Default auto-hide duration (ms) for success notifications.
// * Errors default to no auto-hide so the user can read the failure reason.
const DEFAULT_SUCCESS_AUTO_HIDE_MS: number = 3000;

// * Props for the shared NotificationBanner component. The parent derives
// * `open`, `severity`, and `message` from a React Query mutation's
// * isSuccess/isError states so this component stays purely presentational.
interface INotificationBannerProps {
    open: boolean;
    severity: 'success' | 'error';
    message: string;
    onClose: () => void;
    autoHideDurationMs?: number;
}

// * Resolves the MUI Snackbar autoHideDuration based on severity:
// * - success: caller override, else DEFAULT_SUCCESS_AUTO_HIDE_MS
// * - error: caller override, else null (no auto-hide)
const resolveAutoHideDuration = (
    severity: 'success' | 'error',
    autoHideDurationMs: number | undefined,
): number | null => {
    if (severity === 'success') {
        return autoHideDurationMs ?? DEFAULT_SUCCESS_AUTO_HIDE_MS;
    }

    return autoHideDurationMs ?? null;
};

// * Shared success/error feedback banner (Req 5.5, 7.4, 9.4).
// * Uses MUI Snackbar anchored top-center with RTL-aware defaults and an
// * MUI Alert for the colored message. Success notifications auto-hide;
// * errors stay visible by default so the user can read the failure reason.
const NotificationBanner = ({
    open,
    severity,
    message,
    onClose,
    autoHideDurationMs,
}: INotificationBannerProps): JSX.Element => {
    const autoHideDuration: number | null = resolveAutoHideDuration(severity, autoHideDurationMs);

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            className={styles.root}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                elevation={6}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationBanner;
