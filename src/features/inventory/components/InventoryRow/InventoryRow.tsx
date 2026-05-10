import { ListItem, ListItemButton } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import StatusChip from '../../../shared/components/StatusChip/StatusChip';
import { formatDate } from '../../../shared/utils/formatDate';
import type { IInventoryItem, TItemType } from '../../models/inventoryItem';

import styles from './inventoryRow.module.scss';

// * Props for a clickable InventoryRow bound to a single item (Req 3.1).
interface IInventoryRowProps {
    item: IInventoryItem;
    onOpen: (item: IInventoryItem) => void;
}

// * Hebrew display labels for TItemType. The row shows them as a secondary
// * line under the item serial so the viewer sees the category at a glance.
const ITEM_TYPE_LABELS: Record<TItemType, string> = {
    weapon: 'ערד',
    sight: 'מכוון',
};

// * Inline SVG for the "weapon" glyph keeps the silhouette close to the
// * reference image without pulling in an extra SVG-import plugin.
const WeaponGlyph = (): JSX.Element => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden>
        <path
            d="M3 11.25h10.5l1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5v1.5H15l-1.5 1.5h-3l-1.5 1.5H6l-1.5-1.5H3v-3Z"
            fill="currentColor"
        />
        <path d="M6 14.25h3v1.5H6z" fill="currentColor" />
    </svg>
);

// * Renders a single inventory record as a clickable card-style list row
// * (Req 3.1, 3.2, 3.3). Layout puts the category icon tile on the reading-
// * order start (right in RTL), the serial + type stack in the middle, and
// * the inspection date + status trailing on the far side.
const InventoryRow = ({ item, onOpen }: IInventoryRowProps): JSX.Element => {
    const typeLabel: string = ITEM_TYPE_LABELS[item.type];
    const formattedInspectionDate: string = formatDate(item.lastInspectionDate);
    const isWeapon: boolean = item.type === 'weapon';

    const handleClick = (): void => {
        onOpen(item);
    };

    return (
        <ListItem disablePadding className={styles.listItem}>
            <ListItemButton
                className={styles.root}
                onClick={handleClick}
                aria-label={`${item.name} ${item.serialNumber}`}
            >
                <div className={styles.trailing}>
                    <span className={styles.date}>{formattedInspectionDate}</span>
                    <StatusChip status={item.status} />
                </div>

                <div className={styles.info}>
                    <span className={styles.name}>{item.serialNumber}</span>
                    <span className={styles.type}>{typeLabel}</span>
                </div>

                <span
                    className={`${styles.iconTile} ${isWeapon ? styles.iconTileWeapon : styles.iconTileSight
                        }`}
                    aria-hidden
                >
                    {isWeapon ? <WeaponGlyph /> : <GpsFixedIcon className={styles.glyph} />}
                </span>
            </ListItemButton>
        </ListItem>
    );
};

export default InventoryRow;
