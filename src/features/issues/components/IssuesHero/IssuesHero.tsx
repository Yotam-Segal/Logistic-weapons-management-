import { InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import IssueFilter, { type TIssueStatusFilter } from '../IssueFilter/IssueFilter';

import styles from './issuesHero.module.scss';

// * Props for the IssuesHero — a pure presentational container holding the
// * page title, free-text search, and status filter pills. State is owned
// * by the parent page so this component stays purely layout + styling.
interface IIssuesHeroProps {
    title: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter: TIssueStatusFilter;
    onStatusFilterChange: (value: TIssueStatusFilter) => void;
}

// * Placeholder copy matches the inventory hero for cross-page consistency;
// * callers can search on issue id, item id, or the Hebrew issue type.
const SEARCH_PLACEHOLDER: string = 'חיפוש לפי מס״ד, סוג תקלה או פריט...';

// * Dark navy hero band rendered at the top of the issues view. Groups the
// * page title, free-text search, and status filter pills (Req 6.1, 8.1)
// * so the user always sees every control before scanning the list below.
const IssuesHero = ({
    title,
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: IIssuesHeroProps): JSX.Element => {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        onSearchChange(event.target.value);
    };

    return (
        <section className={styles.root} aria-label={title}>
            <Typography className={styles.title} component="h1">
                {title}
            </Typography>

            <TextField
                className={styles.search}
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={SEARCH_PLACEHOLDER}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                    classes: { root: styles.searchInput, notchedOutline: styles.searchOutline },
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className={styles.searchIcon} fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

            <div className={styles.filter}>
                <IssueFilter value={statusFilter} onChange={onStatusFilterChange} />
            </div>
        </section>
    );
};

export default IssuesHero;
