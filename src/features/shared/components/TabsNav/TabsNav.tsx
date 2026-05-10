import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import InventoryOutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useAtomValue } from 'jotai';

import { locationAtom, roleAtom } from '../../stores/session';
import useIssues from '../../../issues/hooks/useIssues';
import type { IIssue, TIssueStatus } from '../../../issues/models/issue';
import type { TRole } from '../../models/role';

import styles from './tabsNav.module.scss';

// * A single tab entry in the role-based bottom navigation bar. `value`
// * doubles as the target path so the active tab matches `location.pathname`
// * directly and `useNavigate(value)` is trivial.
interface ITabItem {
    label: string;
    value: string;
    icon: JSX.Element;
    withBadge?: boolean;
}

const INVENTORY_TAB: ITabItem = {
    label: 'מלאי',
    value: '/inventory',
    icon: <InventoryOutlinedIcon />,
};

const ISSUES_TAB: ITabItem = {
    label: 'תקלות ותיאומים',
    value: '/issues',
    icon: <ReportProblemOutlinedIcon />,
    withBadge: true,
};

// * Resolves the tabs visible to a given role (Req 11.1-11.3).
const getTabsForRole = (role: TRole | null): ITabItem[] => {
    if (role === 'rabashatz') {
        return [ISSUES_TAB, INVENTORY_TAB];
    }
    if (role === 'technician') {
        return [ISSUES_TAB];
    }
    return [];
};

// * Resolves the active BottomNavigation value for the current URL so tab
// * highlight tracks the router across programmatic navigations.
const resolveActiveValue = (tabs: ITabItem[], pathname: string): string | false => {
    const match = tabs.find(
        (tab) => pathname === tab.value || pathname.startsWith(`${tab.value}/`),
    );
    return match ? match.value : false;
};

// * Issue statuses that count as "unresolved" for the tab badge. The badge
// * only shows work the user still needs to do, so the "resolved" terminal
// * state is excluded.
const UNRESOLVED_STATUSES: readonly TIssueStatus[] = [
    'תקלה מחכה לתיאום',
    'תיקון מחכה לאישור טכנאי',
    'תיקון תואם',
];

const countUnresolved = (issues: readonly IIssue[] | undefined): number => {
    if (issues === undefined) {
        return 0;
    }
    return issues.filter((issue: IIssue): boolean =>
        UNRESOLVED_STATUSES.includes(issue.status),
    ).length;
};

// * Role-based bottom navigation bar rendered by `MainLayout` (Req 11.1-11.3).
// *
// * The bar fixes to the viewport bottom (see `tabsNav.module.scss`) so it
// * behaves like a mobile-first tab bar even on desktop widths, matching the
// * landing-page design. The Issues tab carries a red badge showing the
// * unresolved count scoped to the active location.
const TabsNav = (): JSX.Element | null => {
    const role = useAtomValue(roleAtom);
    const locationId = useAtomValue(locationAtom);
    const navigate = useNavigate();
    const location = useLocation();

    const tabs: ITabItem[] = useMemo(() => getTabsForRole(role), [role]);
    const activeValue: string | false = resolveActiveValue(tabs, location.pathname);

    // * The query hook no-ops when `locationId === null`, so this is safe
    // * to call even on the role-selector route should the nav ever render.
    const issuesQuery = useIssues(locationId);
    const badgeCount: number = countUnresolved(issuesQuery.data);

    if (tabs.length === 0) {
        return null;
    }

    const handleChange = (_event: React.SyntheticEvent, nextValue: string): void => {
        navigate(nextValue);
    };

    return (
        <nav className={styles.nav} aria-label="תפריט ראשי">
            <BottomNavigation
                className={styles.bar}
                value={activeValue}
                onChange={handleChange}
                showLabels
            >
                {tabs.map((tab: ITabItem) => (
                    <BottomNavigationAction
                        key={tab.value}
                        className={styles.action}
                        label={tab.label}
                        value={tab.value}
                        icon={
                            tab.withBadge ? (
                                <Badge
                                    color="error"
                                    badgeContent={badgeCount}
                                    max={9}
                                    overlap="rectangular"
                                >
                                    {tab.icon}
                                </Badge>
                            ) : (
                                tab.icon
                            )
                        }
                    />
                ))}
            </BottomNavigation>
        </nav>
    );
};

export default TabsNav;
