import { List } from '@mui/material';

import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import type { IInventoryItem } from '../../models/inventoryItem';
import InventoryRow from '../InventoryRow/InventoryRow';

import styles from './inventoryList.module.scss';

// * Props for the InventoryList (Req 3.1, 3.4).
// * `items` is the pre-filtered, pre-scoped dataset from useInventory;
// * location scoping (Req 2.2) and type filtering (Req 4.3–4.5) happen
// * upstream on the page, so this component is purely presentational.
interface IInventoryListProps {
    items: readonly IInventoryItem[];
    onOpen: (item: IInventoryItem) => void;
}

// * Renders the inventory as a vertical list of `InventoryRow` items (Req 3.1).
// *
// * When the incoming list is empty the shared `EmptyState` is rendered with
// * its default "לא נמצאו נתונים" copy (Req 3.4). The list itself is wrapped
// * in MUI `List` so focus, keyboard navigation, and spacing follow MUI's
// * accessibility defaults.
const InventoryList = ({ items, onOpen }: IInventoryListProps): JSX.Element => {
    if (items.length === 0) {
        return <EmptyState />;
    }

    return (
        <List className={styles.root} disablePadding>
            {items.map((item) => (
                <InventoryRow key={item.id} item={item} onOpen={onOpen} />
            ))}
        </List>
    );
};

export default InventoryList;
