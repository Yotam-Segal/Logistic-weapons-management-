import { useState } from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';

import type { TIssueType } from '../../../issues/models/issue';

import styles from './reportIssueForm.module.scss';

// * Props for the ReportIssueForm.
// * `onSubmit` receives a validated payload; `isSubmitting` lets the parent
// * gate the submit button while a mutation is in flight (Req 5.3, 5.5).
interface IReportIssueFormProps {
    onSubmit: (values: { issueType: TIssueType; comment?: string }) => void;
    isSubmitting?: boolean;
}

// * Internal type for the issueType field — the empty string sentinel covers
// * the "not yet chosen" state so we don't ship `undefined`/`null` through the
// * MUI Select, which expects a string value.
type TIssueTypeFieldValue = TIssueType | '';

// * Full Issue_Type list from the design doc (Req 5.2). Kept as a const-tuple
// * so the options rendered in the Select stay in sync with TIssueType.
const ISSUE_TYPE_OPTIONS: readonly TIssueType[] = [
    'מעצור חולץ',
    'שבר בפין פציל',
    'קנה שחוק',
    'בעיית דריכה',
    'ידית דריכה תקועה',
    'בעיית הזנה',
    'חלק חסר',
    'אחר',
];

// * Hebrew copy for the form. Labels and messages are centralized so text
// * tweaks stay in one place and match the RTL layout naturally.
const ISSUE_TYPE_LABEL: string = 'סוג תקלה';
const ISSUE_TYPE_LABEL_ID: string = 'report-issue-type-label';
const COMMENT_LABEL: string = 'הערה (אופציונלי)';
const SUBMIT_LABEL: string = 'דווח';
const MISSING_ISSUE_TYPE_MESSAGE: string = 'נא לבחור סוג תקלה';

// * Issue reporting form rendered inside the ItemDrawer (Req 5.2, 5.4).
// *
// * Responsibilities:
// *   - Collect a required Issue_Type and an optional comment.
// *   - Validate client-side: block submission and surface a field-level error
// *     when no Issue_Type is chosen (Req 5.4).
// *   - Hand a clean payload to the parent's `onSubmit` so the mutation layer
// *     stays decoupled from form state (Req 5.3 lives in useReportIssue).
// *
// * Why `submitted` local state:
// *   We only want to show the validation error after the user has actually
// *   tried to submit, not on first render. Derived from a submit handler
// *   rather than an effect so no `useEffect` is needed.
const ReportIssueForm = ({ onSubmit, isSubmitting }: IReportIssueFormProps): JSX.Element => {
    const [issueType, setIssueType] = useState<TIssueTypeFieldValue>('');
    const [comment, setComment] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const showTypeError: boolean = submitted && issueType === '';

    const handleIssueTypeChange = (event: SelectChangeEvent<TIssueTypeFieldValue>): void => {
        setIssueType(event.target.value as TIssueTypeFieldValue);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setComment(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setSubmitted(true);

        if (issueType === '') {
            return;
        }

        const trimmedComment: string = comment.trim();
        onSubmit({
            issueType,
            comment: trimmedComment === '' ? undefined : trimmedComment,
        });
    };

    return (
        <form className={styles.root} onSubmit={handleSubmit} noValidate>
            <FormControl
                className={styles.field}
                fullWidth
                required
                error={showTypeError}
                size="small"
            >
                <InputLabel id={ISSUE_TYPE_LABEL_ID}>{ISSUE_TYPE_LABEL}</InputLabel>
                <Select
                    labelId={ISSUE_TYPE_LABEL_ID}
                    label={ISSUE_TYPE_LABEL}
                    value={issueType}
                    onChange={handleIssueTypeChange}
                >
                    {ISSUE_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                {showTypeError && <FormHelperText>{MISSING_ISSUE_TYPE_MESSAGE}</FormHelperText>}
            </FormControl>

            <TextField
                className={styles.field}
                label={COMMENT_LABEL}
                value={comment}
                onChange={handleCommentChange}
                multiline
                minRows={3}
                fullWidth
                size="small"
            />

            <Button
                className={styles.submit}
                type="submit"
                variant="contained"
                disabled={isSubmitting === true}
            >
                {SUBMIT_LABEL}
            </Button>
        </form>
    );
};

export default ReportIssueForm;
