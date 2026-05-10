import { useAtomValue } from 'jotai';
import { Typography } from '@mui/material';

import AppDrawer from '../../../shared/components/AppDrawer/AppDrawer';
import StatusChip from '../../../shared/components/StatusChip/StatusChip';
import { roleAtom } from '../../../shared/stores/session';
import type { TRole } from '../../../shared/models/role';
import type { IIssue, TIssueStatus } from '../../models/issue';
import CoordinateAction from '../CoordinateAction/CoordinateAction';
import ResolveAction from '../ResolveAction/ResolveAction';

import styles from './issueDrawer.module.scss';

// * Props for the IssueDrawer.
// * `issue === null` means the drawer is closed — it renders a closed AppDrawer
// * and skips the detail/action blocks to avoid null dereferences (Req 7.1, 9.1).
interface IIssueDrawerProps {
    issue: IIssue | null;
    onClose: () => void;
}

// * Hebrew copy for titles and labels. Kept alongside the component so copy
// * edits stay in one place and the RTL record reads naturally.
const DRAWER_TITLE: string = 'פרטי תקלה';
const ACTION_SECTION_TITLE: string = 'פעולה';
const ID_LABEL: string = 'מזהה';
const ITEM_ID_LABEL: string = 'מזהה פריט';
const ISSUE_TYPE_LABEL: string = 'סוג תקלה';
const STATUS_LABEL: string = 'סטטוס';
const COMMENT_LABEL: string = 'הערה';

// * Status on which the Rabashatz coordinate action is exposed (Req 7.2).
const STATUS_PENDING_COORDINATION: TIssueStatus = 'תקלה מחכה לתיאום';

// * Role identifiers — typed against TRole so the comparison stays exhaustive.
const ROLE_RABASHATZ: TRole = 'rabashatz';
const ROLE_TECHNICIAN: TRole = 'technician';

// * Side drawer for viewing an issue and performing the role-appropriate
// * next action (Req 7.1, 7.2, 9.1, 9.2).
// *
// * Behavior:
// *   - Opens when `issue !== null`; closes via the close control or after
// *     a successful action mutation — the action components call
// *     `onClose` through their optional `onCoordinated` / `onResolved`
// *     callbacks. Parent refresh happens through the mutations' built-in
// *     query invalidation on `['issues', locationId]` (Req 7.4, 9.4).
// *   - Action selection by role + status:
// *       · role === 'rabashatz' AND status === 'תקלה מחכה לתיאום'
// *         → CoordinateAction (Req 7.2)
// *       · role === 'technician'
// *         → ResolveAction (Req 9.2)
// *       · otherwise → detail block only, no action slot
// *
// * The comment row is only rendered when a non-empty comment is present,
// * so issues without a comment don't show a dangling empty label.
const IssueDrawer = ({ issue, onClose }: IIssueDrawerProps): JSX.Element => {
    const role: TRole | null = useAtomValue(roleAtom);

    const isOpen: boolean = issue !== null;
    const hasComment: boolean =
        issue !== null && typeof issue.comment === 'string' && issue.comment.length > 0;

    const showCoordinate: boolean =
        issue !== null
        && role === ROLE_RABASHATZ
        && issue.status === STATUS_PENDING_COORDINATION;
    const showResolve: boolean = issue !== null && role === ROLE_TECHNICIAN;
    const hasAction: boolean = showCoordinate || showResolve;

    return (
        <AppDrawer open={isOpen} onClose={onClose} title={DRAWER_TITLE}>
            {issue !== null && (
                <div className={styles.root}>
                    <section className={styles.details} aria-label={DRAWER_TITLE}>
                        <Typography className={styles.detail} variant="body2">
                            <span className={styles.label}>{ID_LABEL}:</span>
                            <span>{issue.id}</span>
                        </Typography>
                        <Typography className={styles.detail} variant="body2">
                            <span className={styles.label}>{ITEM_ID_LABEL}:</span>
                            <span>{issue.itemId}</span>
                        </Typography>
                        <Typography className={styles.detail} variant="body2">
                            <span className={styles.label}>{ISSUE_TYPE_LABEL}:</span>
                            <span>{issue.issueType}</span>
                        </Typography>
                        <div className={styles.status}>
                            <span className={styles.label}>{STATUS_LABEL}:</span>
                            <StatusChip status={issue.status} />
                        </div>
                        {hasComment ? (
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{COMMENT_LABEL}:</span>
                                <span>{issue.comment}</span>
                            </Typography>
                        ) : null}
                    </section>

                    {hasAction ? (
                        <>
                            <hr className={styles.divider} />
                            <section aria-label={ACTION_SECTION_TITLE}>
                                <h3 className={styles.sectionTitle}>
                                    {ACTION_SECTION_TITLE}
                                </h3>
                                {showCoordinate ? (
                                    <CoordinateAction
                                        issue={issue}
                                        onCoordinated={onClose}
                                    />
                                ) : null}
                                {showResolve ? (
                                    <ResolveAction
                                        issue={issue}
                                        onResolved={onClose}
                                    />
                                ) : null}
                            </section>
                        </>
                    ) : null}
                </div>
            )}
        </AppDrawer>
    );
};

export default IssueDrawer;
