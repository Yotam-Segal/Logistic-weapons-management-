import { List } from '@mui/material';

import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import type { IIssue } from '../../models/issue';
import IssueRow from '../IssueRow/IssueRow';

import styles from './issuesList.module.scss';

// * Props for the IssuesList (Req 6.1, 6.3, 8.1, 8.3).
// * `issues` is the pre-filtered, location-scoped dataset from useIssues;
// * scoping (Req 2.2) happens upstream on the page so this component is
// * purely presentational.
interface IIssuesListProps {
    issues: readonly IIssue[];
    onOpen: (issue: IIssue) => void;
}

// * Renders issues as a vertical list of `IssueRow` items (Req 6.1, 8.1).
// *
// * When the incoming list is empty the shared `EmptyState` is rendered with
// * its default "לא נמצאו נתונים" copy (Req 6.3, 8.3). The list itself is
// * wrapped in MUI `List` so focus, keyboard navigation, and spacing follow
// * MUI's accessibility defaults — mirroring `InventoryList` for consistency.
const IssuesList = ({ issues, onOpen }: IIssuesListProps): JSX.Element => {
    if (issues.length === 0) {
        return <EmptyState />;
    }

    return (
        <List className={styles.root} disablePadding>
            {issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} onOpen={onOpen} />
            ))}
        </List>
    );
};

export default IssuesList;
