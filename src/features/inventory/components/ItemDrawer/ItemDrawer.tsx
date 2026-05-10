import { Typography } from '@mui/material';

import AppDrawer from '../../../shared/components/AppDrawer/AppDrawer';
import NotificationBanner from '../../../shared/components/NotificationBanner/NotificationBanner';
import StatusChip from '../../../shared/components/StatusChip/StatusChip';
import { formatDate } from '../../../shared/utils/formatDate';
import useItemDrawerController from '../../hooks/useItemDrawerController';
import type { IInventoryItem, TItemType } from '../../models/inventoryItem';
import ReportIssueForm from '../ReportIssueForm/ReportIssueForm';

import styles from './itemDrawer.module.scss';

// * Props for the ItemDrawer.
// * `item === null` means the drawer is closed — it renders a closed AppDrawer
// * and skips the detail/form blocks to avoid conditional crashes (Req 5.1).
interface IItemDrawerProps {
    item: IInventoryItem | null;
    onClose: () => void;
}

// * Hebrew copy for labels and titles. Kept here (alongside the component)
// * so copy edits stay in one place and RTL flow reads naturally.
const DRAWER_TITLE: string = 'פרטי פריט';
const REPORT_SECTION_TITLE: string = 'דיווח תקלה';
const ID_LABEL: string = 'מזהה';
const SERIAL_NUMBER_LABEL: string = 'מספר סידורי';
const NAME_LABEL: string = 'שם';
const TYPE_LABEL: string = 'סוג';
const LAST_INSPECTION_LABEL: string = 'בדיקה אחרונה';
const STATUS_LABEL: string = 'סטטוס';

// * Hebrew display labels for TItemType. Mirrors InventoryRow so the drawer
// * and list show the same localized value for each item (Req 5.1).
const ITEM_TYPE_LABELS: Record<TItemType, string> = {
    weapon: 'נשק',
    sight: 'מכוון',
};

// * Side drawer for viewing an inventory item and reporting an issue against it
// * (Req 5.1, 5.3, 5.5, 5.6).
// *
// * Behavior:
// *   - Opens when `item !== null`; closes via the close control or after a
// *     successful issue submission (Req 5.5, 5.6).
// *   - Submits via `useItemDrawerController`, which owns the mutation and
// *     the success/error banner state.
// *   - Close control never mutates — it only calls `onClose` (Req 5.6).
// *
// * The banner lives outside the drawer content on purpose: MUI's Snackbar
// * is fixed-position, so keeping it at the component root ensures it stays
// * visible even after the drawer closes on success.
const ItemDrawer = ({ item, onClose }: IItemDrawerProps): JSX.Element => {
    const { submit, isSubmitting, banner } = useItemDrawerController(item, onClose);

    const isOpen: boolean = item !== null;

    return (
        <>
            <AppDrawer open={isOpen} onClose={onClose} title={DRAWER_TITLE}>
                {item !== null && (
                    <div className={styles.root}>
                        <section className={styles.details} aria-label={DRAWER_TITLE}>
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{ID_LABEL}:</span>
                                <span>{item.id}</span>
                            </Typography>
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{SERIAL_NUMBER_LABEL}:</span>
                                <span>{item.serialNumber}</span>
                            </Typography>
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{NAME_LABEL}:</span>
                                <span>{item.name}</span>
                            </Typography>
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{TYPE_LABEL}:</span>
                                <span>{ITEM_TYPE_LABELS[item.type]}</span>
                            </Typography>
                            <Typography className={styles.detail} variant="body2">
                                <span className={styles.label}>{LAST_INSPECTION_LABEL}:</span>
                                <span>{formatDate(item.lastInspectionDate)}</span>
                            </Typography>
                            <div className={styles.status}>
                                <span className={styles.label}>{STATUS_LABEL}:</span>
                                <StatusChip status={item.status} />
                            </div>
                        </section>

                        <hr className={styles.divider} />

                        <section aria-label={REPORT_SECTION_TITLE}>
                            <h3 className={styles.sectionTitle}>{REPORT_SECTION_TITLE}</h3>
                            <ReportIssueForm onSubmit={submit} isSubmitting={isSubmitting} />
                        </section>
                    </div>
                )}
            </AppDrawer>

            {banner !== null && (
                <NotificationBanner
                    open={banner.open}
                    severity={banner.severity}
                    message={banner.message}
                    onClose={banner.onClose}
                />
            )}
        </>
    );
};

export default ItemDrawer;
