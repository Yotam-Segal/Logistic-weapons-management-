import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';

import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import { locationAtom } from '../../../shared/stores/session';
import IssueDrawer from '../../components/IssueDrawer/IssueDrawer';
import IssuesHero from '../../components/IssuesHero/IssuesHero';
import IssuesList from '../../components/IssuesList/IssuesList';
import type { TIssueStatusFilter } from '../../components/IssueFilter/IssueFilter';
import useIssues from '../../hooks/useIssues';
import type { IIssue } from '../../models/issue';

import styles from './issuesPage.module.scss';

// * Copy for the "no location selected" empty state (Req 2.4).
const NO_LOCATION_MESSAGE: string = 'נא לבחור מיקום';

// * Default status filter selection on page load.
const DEFAULT_STATUS_FILTER: TIssueStatusFilter = 'all';

// * Hero title matches the reference wording for the issues view.
const PAGE_TITLE: string = 'תקלות ותיאומים';

// * Narrows the issues dataset by a free-text query against issue id,
// * item id, and the Hebrew issue type. Kept outside the component so
// * re-renders don't rebuild the predicate.
const filterBySearch = (
    issues: readonly IIssue[],
    query: string,
): readonly IIssue[] => {
    const trimmed: string = query.trim().toLowerCase();
    if (trimmed === '') {
        return issues;
    }

    return issues.filter((issue: IIssue): boolean => {
        const id: string = issue.id.toLowerCase();
        const itemId: string = issue.itemId.toLowerCase();
        const issueType: string = issue.issueType.toLowerCase();
        return (
            id.includes(trimmed) || itemId.includes(trimmed) || issueType.includes(trimmed)
        );
    });
};

// * Narrows by the status filter. `'all'` is a pass-through so the same
// * predicate chain works for every filter selection.
const filterByStatus = (
    issues: readonly IIssue[],
    filter: TIssueStatusFilter,
): readonly IIssue[] => {
    if (filter === 'all') {
        return issues;
    }
    return issues.filter((issue: IIssue): boolean => issue.status === filter);
};

// * Issues view for both Rabashatz_User and Technician_User (Req 2.2, 2.4,
// * 6.1, 6.3, 8.1, 8.3).
// *
// * Layout mirrors `InventoryPage` so the two primary pages share the same
// * shell: a dark navy hero with title, search, and filter pills; a vertical
// * list of card-shaped rows; and a slide-in drawer for per-row actions.
// * Role gating for the per-issue actions still lives inside `IssueDrawer`,
// * which reads `roleAtom` directly — so this page stays thin.
const IssuesPage = (): JSX.Element => {
    const locationId: string | null = useAtomValue(locationAtom);
    const [statusFilter, setStatusFilter] =
        useState<TIssueStatusFilter>(DEFAULT_STATUS_FILTER);
    const [searchValue, setSearchValue] = useState<string>('');
    const [openIssue, setOpenIssue] = useState<IIssue | null>(null);

    const issuesQuery = useIssues(locationId);
    const issuesData: IIssue[] | undefined = issuesQuery.data;

    const visibleIssues: readonly IIssue[] = useMemo(() => {
        const byStatus: readonly IIssue[] = filterByStatus(issuesData ?? [], statusFilter);
        return filterBySearch(byStatus, searchValue);
    }, [issuesData, statusFilter, searchValue]);

    const handleCloseDrawer = (): void => {
        setOpenIssue(null);
    };

    if (locationId === null) {
        return (
            <Box className={styles.root} component="main">
                <EmptyState message={NO_LOCATION_MESSAGE} />
            </Box>
        );
    }

    return (
        <Box className={styles.root} component="main">
            <IssuesHero
                title={PAGE_TITLE}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />
            <Box className={styles.list}>
                <IssuesList issues={visibleIssues} onOpen={setOpenIssue} />
            </Box>
            <IssueDrawer issue={openIssue} onClose={handleCloseDrawer} />
        </Box>
    );
};

export default IssuesPage;
