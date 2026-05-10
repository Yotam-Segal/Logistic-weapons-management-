import type { ReactNode } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { getStatusColor } from '../../utils/statusColorMap';
import type { TIssueStatus, TItemStatus } from '../../models';

import styles from './statusChip.module.scss';

// * Props for the shared StatusChip component.
interface IStatusChipProps {
    status: TItemStatus | TIssueStatus;
}

// * Small leading glyph per status. Matches the landing-page design where
// * each row's status reads as a colored label + icon rather than a filled
// * pill. Keeping the map exhaustive (every TItemStatus + TIssueStatus)
// * guards against the union drifting away from the rendered set.
const STATUS_ICON_MAP: Record<TItemStatus | TIssueStatus, ReactNode> = {
    תקין: <CheckCircleOutlineIcon fontSize="inherit" />,
    תקול: <ErrorOutlineIcon fontSize="inherit" />,
    'פג תוקף': <ReportProblemOutlinedIcon fontSize="inherit" />,
    'נדרש מטווח': <GpsFixedIcon fontSize="inherit" />,
    'תקלה מחכה לתיאום': <HourglassEmptyIcon fontSize="inherit" />,
    'תיקון מחכה לאישור טכנאי': <ScheduleIcon fontSize="inherit" />,
    'תיקון תואם': <HandymanOutlinedIcon fontSize="inherit" />,
    'תקלה טופלה': <DoneAllIcon fontSize="inherit" />,
};

// * Renders a status value as a colored label + small glyph (Req 3.3, 6.2,
// * 8.2, 10.1). The color comes from the centralized STATUS_COLOR_MAP so
// * every surface shares the same palette without redefining hues.
const StatusChip = ({ status }: IStatusChipProps): JSX.Element => {
    const color: string = getStatusColor(status);

    return (
        <span className={styles.root} style={{ color }} role="status">
            <span className={styles.icon} aria-hidden>
                {STATUS_ICON_MAP[status]}
            </span>
            <span className={styles.label}>{status}</span>
        </span>
    );
};

export default StatusChip;
