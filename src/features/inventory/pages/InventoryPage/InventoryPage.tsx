import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';

import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import { locationAtom } from '../../../shared/stores/session';
import InventoryHero from '../../components/InventoryHero/InventoryHero';
import InventoryList from '../../components/InventoryList/InventoryList';
import ItemDrawer from '../../components/ItemDrawer/ItemDrawer';
import useInventory, { type TInventoryTypeFilter } from '../../hooks/useInventory';
import type { IInventoryItem } from '../../models/inventoryItem';

import styles from './inventoryPage.module.scss';

// * Copy for the "no location selected" empty state (Req 2.4).
const NO_LOCATION_MESSAGE: string = 'נא לבחור מיקום';

// * Default inventory type filter selection on page load (Req 4.2).
const DEFAULT_TYPE_FILTER: TInventoryTypeFilter = 'both';

// * Hero title — matches the reference copy on the design.
const PAGE_TITLE: string = 'ממצאי יישוב';

// * Narrows an inventory dataset by a free-text query against the serial
// * number and the display name. Kept outside the component so re-renders
// * don't rebuild the predicate.
const filterBySearch = (
    items: readonly IInventoryItem[],
    query: string,
): readonly IInventoryItem[] => {
    const trimmed: string = query.trim().toLowerCase();
    if (trimmed === '') {
        return items;
    }

    return items.filter((item: IInventoryItem): boolean => {
        const serial: string = item.serialNumber.toLowerCase();
        const name: string = item.name.toLowerCase();
        return serial.includes(trimmed) || name.includes(trimmed);
    });
};

// * Inventory view for the Rabashatz_User (Req 2.2, 2.4, 3.1, 3.4, 4.1, 4.2).
// *
// * Layout follows the landing-page design:
// *   - A dark navy hero with the page title, search input, and filter pills.
// *   - A vertical list of card-shaped rows on a light surface.
// *   - The ItemDrawer slides in when a row is tapped.
// *
// * Responsibilities remain unchanged from the previous revision: read the
// * active location, own the type-filter and search states, and delegate
// * data loading to `useInventory`. The hook's `enabled: locationId !== null`
// * gate keeps the query inert until a location is picked (Req 2.4).
const InventoryPage = (): JSX.Element => {
    const locationId: string | null = useAtomValue(locationAtom);
    const [typeFilter, setTypeFilter] = useState<TInventoryTypeFilter>(DEFAULT_TYPE_FILTER);
    const [searchValue, setSearchValue] = useState<string>('');
    const [openItem, setOpenItem] = useState<IInventoryItem | null>(null);

    const inventoryQuery = useInventory(locationId, typeFilter);
    const inventoryData: IInventoryItem[] | undefined = inventoryQuery.data;

    const visibleItems: readonly IInventoryItem[] = useMemo(
        () => filterBySearch(inventoryData ?? [], searchValue),
        [inventoryData, searchValue],
    );

    const handleCloseDrawer = (): void => {
        setOpenItem(null);
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
            <InventoryHero
                title={PAGE_TITLE}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
            />
            <Box className={styles.list}>
                <InventoryList items={visibleItems} onOpen={setOpenItem} />
            </Box>
            <ItemDrawer item={openItem} onClose={handleCloseDrawer} />
        </Box>
    );
};

export default InventoryPage;
