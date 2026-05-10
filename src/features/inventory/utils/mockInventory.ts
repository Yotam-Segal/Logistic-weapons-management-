// * Seeded inventory dataset and mock HTTP handlers used while the app runs
// * without a real backend (Req 3.1, 4.3–4.5). When a real API becomes
// * available the handlers here disappear and the UI stays unchanged.
import type { AxiosRequestConfig } from 'axios';
import type { IInventoryItem, TItemType } from '../models/inventoryItem';
import { mockAdapter } from '../../shared/utils/mockAdapter';

type TTypeFilter = TItemType | 'both';

interface IInventoryQueryParams {
  locationId?: string;
  type?: TTypeFilter;
}

// * Seeded dataset spread across every TItemStatus and TItemType, with a
// * dozen entries per location so list/filter flows have meaningful volume
// * during development. Serial numbers follow a short prefix convention:
// *   AR = rifle, PS = pistol, MG = machine gun, SI = sight, ML = Meprolight,
// *   TR = Trijicon, LZ = laser aim — purely cosmetic, not enforced by code.
export const INITIAL_MOCK_INVENTORY: readonly IInventoryItem[] = [
  // --- loc-south ---------------------------------------------------------
  {
    id: 'inv-001',
    serialNumber: 'AR-10291',
    name: 'רובה M4',
    type: 'weapon',
    lastInspectionDate: new Date('2026-06-05'),
    status: 'תקין',
    locationId: 'loc-south',
  },
  {
    id: 'inv-002',
    serialNumber: 'PS-48392',
    name: 'אקדח גלוק 19',
    type: 'weapon',
    lastInspectionDate: new Date('2026-05-01'),
    status: 'פג תוקף',
    locationId: 'loc-south',
  },
  {
    id: 'inv-003',
    serialNumber: 'SI-55667',
    name: 'מכוון ACOG TA31',
    type: 'sight',
    lastInspectionDate: new Date('2026-11-22'),
    status: 'תקול',
    locationId: 'loc-south',
  },
  {
    id: 'inv-004',
    serialNumber: 'SI-23741',
    name: 'מכוון מיקרו T2',
    type: 'sight',
    lastInspectionDate: new Date('2026-07-05'),
    status: 'נדרש מטווח',
    locationId: 'loc-south',
  },
  {
    id: 'inv-011',
    serialNumber: 'AR-34456',
    name: 'רובה M4 קצר',
    type: 'weapon',
    lastInspectionDate: new Date('2026-04-26'),
    status: 'פג תוקף',
    locationId: 'loc-south',
  },
  {
    id: 'inv-012',
    serialNumber: 'ML-2201',
    name: 'Meprolight M21',
    type: 'sight',
    lastInspectionDate: new Date('2026-03-18'),
    status: 'תקין',
    locationId: 'loc-south',
  },
  {
    id: 'inv-013',
    serialNumber: 'AR-78210',
    name: 'רובה תבור X95',
    type: 'weapon',
    lastInspectionDate: new Date('2026-02-08'),
    status: 'תקין',
    locationId: 'loc-south',
  },
  {
    id: 'inv-014',
    serialNumber: 'MG-90123',
    name: 'מקלע נגב קל',
    type: 'weapon',
    lastInspectionDate: new Date('2025-12-14'),
    status: 'תקול',
    locationId: 'loc-south',
  },
  {
    id: 'inv-015',
    serialNumber: 'SI-61290',
    name: 'מכוון הולוגרפי EOTech',
    type: 'sight',
    lastInspectionDate: new Date('2026-01-11'),
    status: 'תקין',
    locationId: 'loc-south',
  },
  {
    id: 'inv-016',
    serialNumber: 'LZ-44120',
    name: 'מכוון ליזר PEQ-15',
    type: 'sight',
    lastInspectionDate: new Date('2025-10-02'),
    status: 'פג תוקף',
    locationId: 'loc-south',
  },
  {
    id: 'inv-017',
    serialNumber: 'PS-71930',
    name: 'אקדח גלוק 17',
    type: 'weapon',
    lastInspectionDate: new Date('2026-08-19'),
    status: 'נדרש מטווח',
    locationId: 'loc-south',
  },
  {
    id: 'inv-018',
    serialNumber: 'AR-11208',
    name: 'רובה M4A1',
    type: 'weapon',
    lastInspectionDate: new Date('2026-09-07'),
    status: 'תקין',
    locationId: 'loc-south',
  },

  // --- loc-center --------------------------------------------------------
  {
    id: 'inv-005',
    serialNumber: 'MG-20118',
    name: 'מקלע נגב',
    type: 'weapon',
    lastInspectionDate: new Date('2026-10-10'),
    status: 'תקין',
    locationId: 'loc-center',
  },
  {
    id: 'inv-006',
    serialNumber: 'AR-20332',
    name: 'רובה M4',
    type: 'weapon',
    lastInspectionDate: new Date('2026-06-03'),
    status: 'נדרש מטווח',
    locationId: 'loc-center',
  },
  {
    id: 'inv-007',
    serialNumber: 'TR-20451',
    name: 'מכוון טריג׳יקון',
    type: 'sight',
    lastInspectionDate: new Date('2026-08-22'),
    status: 'תקול',
    locationId: 'loc-center',
  },
  {
    id: 'inv-008',
    serialNumber: 'LZ-20519',
    name: 'מכוון ליזר PEQ-2',
    type: 'sight',
    lastInspectionDate: new Date('2026-01-30'),
    status: 'פג תוקף',
    locationId: 'loc-center',
  },
  {
    id: 'inv-019',
    serialNumber: 'AR-20777',
    name: 'רובה תבור',
    type: 'weapon',
    lastInspectionDate: new Date('2026-11-04'),
    status: 'תקין',
    locationId: 'loc-center',
  },
  {
    id: 'inv-020',
    serialNumber: 'PS-20884',
    name: 'אקדח סיג סאואר',
    type: 'weapon',
    lastInspectionDate: new Date('2026-09-15'),
    status: 'תקין',
    locationId: 'loc-center',
  },
  {
    id: 'inv-021',
    serialNumber: 'ML-2212',
    name: 'Meprolight M21',
    type: 'sight',
    lastInspectionDate: new Date('2026-07-21'),
    status: 'נדרש מטווח',
    locationId: 'loc-center',
  },
  {
    id: 'inv-022',
    serialNumber: 'SI-20937',
    name: 'מכוון מיקרו T1',
    type: 'sight',
    lastInspectionDate: new Date('2026-04-02'),
    status: 'תקין',
    locationId: 'loc-center',
  },
  {
    id: 'inv-023',
    serialNumber: 'AR-21055',
    name: 'רובה M4 ארוך',
    type: 'weapon',
    lastInspectionDate: new Date('2025-11-28'),
    status: 'תקול',
    locationId: 'loc-center',
  },
  {
    id: 'inv-024',
    serialNumber: 'MG-21148',
    name: 'מקלע מאג',
    type: 'weapon',
    lastInspectionDate: new Date('2026-05-18'),
    status: 'פג תוקף',
    locationId: 'loc-center',
  },
  {
    id: 'inv-025',
    serialNumber: 'SI-21260',
    name: 'מכוון הולוגרפי EOTech',
    type: 'sight',
    lastInspectionDate: new Date('2026-03-09'),
    status: 'תקול',
    locationId: 'loc-center',
  },
  {
    id: 'inv-026',
    serialNumber: 'PS-21371',
    name: 'אקדח גלוק 26',
    type: 'weapon',
    lastInspectionDate: new Date('2026-02-24'),
    status: 'נדרש מטווח',
    locationId: 'loc-center',
  },

  // --- loc-north ---------------------------------------------------------
  {
    id: 'inv-009',
    serialNumber: 'AR-30081',
    name: 'רובה תקני M16',
    type: 'weapon',
    lastInspectionDate: new Date('2026-12-01'),
    status: 'תקין',
    locationId: 'loc-north',
  },
  {
    id: 'inv-010',
    serialNumber: 'LZ-30142',
    name: 'מכוון ליזר PEQ-15',
    type: 'sight',
    lastInspectionDate: new Date('2026-05-15'),
    status: 'נדרש מטווח',
    locationId: 'loc-north',
  },
  {
    id: 'inv-027',
    serialNumber: 'AR-30215',
    name: 'רובה גליל ACE',
    type: 'weapon',
    lastInspectionDate: new Date('2026-06-22'),
    status: 'תקין',
    locationId: 'loc-north',
  },
  {
    id: 'inv-028',
    serialNumber: 'MG-30319',
    name: 'מקלע נגב קל',
    type: 'weapon',
    lastInspectionDate: new Date('2026-04-14'),
    status: 'פג תוקף',
    locationId: 'loc-north',
  },
  {
    id: 'inv-029',
    serialNumber: 'PS-30422',
    name: 'אקדח גלוק 19',
    type: 'weapon',
    lastInspectionDate: new Date('2026-08-03'),
    status: 'תקין',
    locationId: 'loc-north',
  },
  {
    id: 'inv-030',
    serialNumber: 'SI-30517',
    name: 'מכוון מיקרו T2',
    type: 'sight',
    lastInspectionDate: new Date('2026-07-28'),
    status: 'תקול',
    locationId: 'loc-north',
  },
  {
    id: 'inv-031',
    serialNumber: 'ML-2233',
    name: 'Meprolight M21',
    type: 'sight',
    lastInspectionDate: new Date('2026-02-11'),
    status: 'תקין',
    locationId: 'loc-north',
  },
  {
    id: 'inv-032',
    serialNumber: 'TR-30650',
    name: 'מכוון טריג׳יקון RMR',
    type: 'sight',
    lastInspectionDate: new Date('2026-09-25'),
    status: 'נדרש מטווח',
    locationId: 'loc-north',
  },
  {
    id: 'inv-033',
    serialNumber: 'AR-30744',
    name: 'רובה M4 קצר',
    type: 'weapon',
    lastInspectionDate: new Date('2026-10-18'),
    status: 'תקול',
    locationId: 'loc-north',
  },
  {
    id: 'inv-034',
    serialNumber: 'SI-30821',
    name: 'מכוון הולוגרפי EOTech',
    type: 'sight',
    lastInspectionDate: new Date('2025-11-07'),
    status: 'פג תוקף',
    locationId: 'loc-north',
  },
  {
    id: 'inv-035',
    serialNumber: 'AR-30939',
    name: 'רובה תבור X95',
    type: 'weapon',
    lastInspectionDate: new Date('2026-03-30'),
    status: 'תקין',
    locationId: 'loc-north',
  },
  {
    id: 'inv-036',
    serialNumber: 'LZ-31025',
    name: 'מכוון ליזר DBAL',
    type: 'sight',
    lastInspectionDate: new Date('2026-01-16'),
    status: 'תקין',
    locationId: 'loc-north',
  },
];

// * Module-scoped snapshot of the dataset. Held as a const today; Task 10.2
// * may read from it when simulating issue reporting flows.
const inventoryDataset: readonly IInventoryItem[] = INITIAL_MOCK_INVENTORY;

const filterInventory = (
  items: readonly IInventoryItem[],
  params: IInventoryQueryParams,
): IInventoryItem[] => {
  const { locationId, type } = params;

  return items.filter((item: IInventoryItem): boolean => {
    if (locationId !== undefined && item.locationId !== locationId) {
      return false;
    }

    if (type !== undefined && type !== 'both' && item.type !== type) {
      return false;
    }

    return true;
  });
};

export const registerInventoryMocks = (): void => {
  mockAdapter
    .onGet('/inventory')
    .reply((config: AxiosRequestConfig): [number, IInventoryItem[]] => {
      const params: IInventoryQueryParams = (config.params ?? {}) as IInventoryQueryParams;
      const filtered: IInventoryItem[] = filterInventory(inventoryDataset, params);
      return [200, filtered];
    });
};
