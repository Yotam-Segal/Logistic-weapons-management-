import { InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import InventoryFilter from '../InventoryFilter/InventoryFilter';
import type { TInventoryTypeFilter } from '../../hooks/useInventory';

import styles from './inventoryHero.module.scss';

// * Props for the InventoryHero — a pure presentational container that
// * owns layout for the title, search box, and filter pills but forwards
// * all state to the parent page.
interface IInventoryHeroProps {
    title: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    typeFilter: TInventoryTypeFilter;
    onTypeFilterChange: (value: TInventoryTypeFilter) => void;
}

// * Hebrew placeholder matching the reference copy.
const SEARCH_PLACEHOLDER: string = 'חיפוש לפי מס״ד, דגם או שם...';

// * Dark navy hero rendered at the top of the inventory view. Groups the
// * page title, free-text search, and type-filter pills so the user sees
// * every control they need before scanning the list below (Req 3.1, 4.1).
const InventoryHero = ({
    title,
    searchValue,
    onSearchChange,
    typeFilter,
    onTypeFilterChange,
}: IInventoryHeroProps): JSX.Element => {
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
                <InventoryFilter value={typeFilter} onChange={onTypeFilterChange} />
            </div>
        </section>
    );
};

export default InventoryHero;
