import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';

import type { TInventoryTypeFilter } from '../../hooks/useInventory';

import styles from './inventoryFilter.module.scss';

// * Props for the controlled InventoryFilter toggle group.
interface IInventoryFilterProps {
    value: TInventoryTypeFilter;
    onChange: (value: TInventoryTypeFilter) => void;
}

// * Labels for the three filter buttons (Req 4.1, 4.3–4.5).
const WEAPON_LABEL: string = 'נשקים';
const SIGHT_LABEL: string = 'כוונות';
const BOTH_LABEL: string = 'הכל';

// * Inventory type filter used on the InventoryPage (Req 4.1, 4.2, 4.3–4.5).
// *
// * The landing-page design renders the three options as pill-shaped chips
// * over the dark hero; the selected pill fills with white, the rest read
// * as ghost outlines. This component remains a pure controlled toggle —
// * the parent page owns the default `'both'` selection and we ignore MUI's
// * `null` payload when the user taps the already-selected option so the
// * "one option is always active" contract holds.
const InventoryFilter = ({ value, onChange }: IInventoryFilterProps): JSX.Element => {
    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: TInventoryTypeFilter | null,
    ): void => {
        if (newValue === null) {
            return;
        }
        onChange(newValue);
    };

    return (
        <ToggleButtonGroup
            className={styles.root}
            value={value}
            exclusive
            onChange={handleChange}
            aria-label="inventory type filter"
        >
            <ToggleButton className={styles.pill} value="both">
                {BOTH_LABEL}
            </ToggleButton>
            <ToggleButton className={styles.pill} value="weapon">
                {WEAPON_LABEL}
                <WeaponIcon />
            </ToggleButton>
            <ToggleButton className={styles.pill} value="sight">
                {SIGHT_LABEL}
                <MyLocationOutlinedIcon fontSize="small" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

// * Small inline SVG sits next to the "נשקים" label on the pill, matching
// * the reference image without pulling in another icon package.
const WeaponIcon = (): JSX.Element => (
    <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fontSize="inherit"
        aria-hidden
        style={{ fontSize: '1rem' }}
    >
        <path
            d="M3 11.25h10.5l1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5v1.5H15l-1.5 1.5h-3l-1.5 1.5H6l-1.5-1.5H3v-3Z"
            fill="currentColor"
        />
    </svg>
);

export default InventoryFilter;
