// * Inventory item domain models (Req 3.1, 4.1).
// * Re-exports TItemStatus from shared so inventory code can import it from its own feature models.
import type { TItemStatus } from '../../shared/models/itemStatus';

export type { TItemStatus };

export type TItemType = 'weapon' | 'sight';

export interface IInventoryItem {
  id: string;
  serialNumber: string;
  name: string;
  type: TItemType;
  lastInspectionDate: Date;
  status: TItemStatus;
  locationId: string;
}
