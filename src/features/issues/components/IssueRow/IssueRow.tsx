import type { ReactNode } from 'react';
import { ListItem, ListItemButton } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import StatusChip from '../../../shared/components/StatusChip/StatusChip';
import { formatDate } from '../../../shared/utils/formatDate';
import { getStatusColor } from '../../../shared/utils/statusColorMap';
import type { IIssue, TIssueStatus } from '../../models/issue';

import styles from './issueRow.module.scss';

// * Props for a clickable IssueRow bound to a single issue (Req 6.1, 8.1).
interface IIssueRowProps {
    issue: IIssue;
    onOpen: (issue: IIssue) => void;
}

// * Leading glyph per status so the card reads at a glance the same way the
// * inventory card does. The tile's tint is driven by `STATUS_COLOR_MAP` at
// * render time so every surface shares one palette.
const STATUS_ICON_MAP: Record<TIssueStatus, ReactNode> = {
    'תקלה מחכה לתיאום': <HourglassEmptyIcon fontSize="small" />,
    'תיקון מחכה לאישור טכנאי': <ScheduleIcon fontSize="small" />,
    'תיקון תואם': <HandymanOutlinedIcon fontSize="small" />,
    'תקלה טופלה': <DoneAllIcon fontSize="small" />,
};

// * Adds alpha to the status hex color so the icon tile reads as a soft
// * tinted surface rather than a saturated block. Color strings in the map
// * are full hex (`#rrggbb`) — see `statusColorMap.ts`.
const TILE_ALPHA: string = '1c'; // ≈ 11% opacity
const withAlpha = (hex: string): string => `${hex}${TILE_ALPHA}`;

// * Renders a single issue record as a clickable card-style list row
// * (Req 6.1, 6.2, 8.1, 8.2). Layout puts the status icon tile on the
// * reading-order start, the issue type + item id stack in the middle,
// * and the report date + status label trailing.
const IssueRow = ({ issue, onOpen }: IIssueRowProps): JSX.Element => {
    const statusColor: string = getStatusColor(issue.status);
    const formattedDate: string = formatDate(issue.createdAt);

    const handleClick = (): void => {
        onOpen(issue);
    };

    return (
        <ListItem disablePadding className={styles.listItem}>
            <ListItemButton
                className={styles.root}
                onClick={handleClick}
                aria-label={`${issue.issueType} ${issue.id}`}
            >
                <div className={styles.trailing}>
                    <span className={styles.date}>{formattedDate}</span>
                    <StatusChip status={issue.status} />
                </div>

                <div className={styles.info}>
                    <span className={styles.name}>{issue.issueType}</span>
                    <span className={styles.meta}>
                        {`פריט ${issue.itemId}`}
                    </span>
                </div>

                <span
                    className={styles.iconTile}
                    style={{
                        backgroundColor: withAlpha(statusColor),
                        color: statusColor,
                    }}
                    aria-hidden
                >
                    {STATUS_ICON_MAP[issue.status]}
                </span>
            </ListItemButton>
        </ListItem>
    );
};

export default IssueRow;
