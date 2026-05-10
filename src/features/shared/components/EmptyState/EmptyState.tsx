import { Box, Typography } from '@mui/material';

import styles from './emptyState.module.scss';

// * Default copy for empty lists across the app (Req 2.4, 3.4, 6.3, 8.3).
const DEFAULT_MESSAGE: string = 'לא נמצאו נתונים';

// * Props for the shared EmptyState component.
interface IEmptyStateProps {
    message?: string;
}

// * Renders a centered placeholder block used by inventory and issue lists
// * when no data is available or no location is selected. The message is
// * overridable so consumers can surface flow-specific copy (Req 2.4, 3.4,
// * 6.3, 8.3) while keeping the visual treatment consistent.
const EmptyState = ({ message = DEFAULT_MESSAGE }: IEmptyStateProps): JSX.Element => {
    return (
        <Box className={styles.root} role="status" aria-live="polite">
            <Typography className={styles.message} variant="body1">
                {message}
            </Typography>
        </Box>
    );
};

export default EmptyState;
