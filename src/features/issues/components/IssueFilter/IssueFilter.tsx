import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { TIssueStatus } from '../../models/issue';

import styles from './issueFilter.module.scss';

// * `'all'` is the default selection — `IssueFilter` exposes it as a string
// * literal instead of adding it to `TIssueStatus` so the shared status type
// * stays the pure domain union.
export type TIssueStatusFilter = TIssueStatus | 'all';

// * Props for the controlled IssueFilter pill group.
interface IIssueFilterProps {
    value: TIssueStatusFilter;
    onChange: (value: TIssueStatusFilter) => void;
}

// * Short Hebrew labels for the filter pills. Full `TIssueStatus` strings
// * are a mouthful inside a tight pill, so the UI collapses them to the
// * workflow stage they describe while the row itself still surfaces the
// * full status via `StatusChip`.
const FILTER_LABELS: Record<TIssueStatusFilter, string> = {
    all: 'הכל',
    'תקלה מחכה לתיאום': 'ממתינות',
    'תיקון מחכה לאישור טכנאי': 'ממתין לאישור',
    'תיקון תואם': 'תואמו',
    'תקלה טופלה': 'טופלו',
};

// * Explicit order for the pills so the user flows left-to-right through
// * the lifecycle stages (hero renders RTL, so visually right-to-left).
const FILTER_ORDER: readonly TIssueStatusFilter[] = [
    'all',
    'תקלה מחכה לתיאום',
    'תיקון מחכה לאישור טכנאי',
    'תיקון תואם',
    'תקלה טופלה',
];

// * Status filter used on the IssuesPage (mirrors InventoryFilter for visual
// * consistency). Pure controlled toggle: the parent page owns the default
// * `'all'` selection and we ignore MUI's `null` payload when the user taps
// * the already-selected pill so the "one option always active" contract
// * holds across both filter chrome.
const IssueFilter = ({ value, onChange }: IIssueFilterProps): JSX.Element => {
    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: TIssueStatusFilter | null,
    ): void => {
        if (newValue === null) {
            return;
        }
        onChange(newValue);
    };

    return (
        <ToggleButtonGroup
            className={styles.root}
            value={value}
            exclusive
            onChange={handleChange}
            aria-label="issue status filter"
        >
            {FILTER_ORDER.map((key) => (
                <ToggleButton key={key} className={styles.pill} value={key}>
                    {FILTER_LABELS[key]}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default IssueFilter;
