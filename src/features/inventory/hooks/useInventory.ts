// * Inventory fetch hook (Req 2.2, 2.4, 3.1, 4.3–4.5).
// * Wraps `useGetRequest` and forwards the location + type filters to the mock
// * GET /inventory handler, which performs the actual filtering server-side.
// * When `type === 'both'` the handler treats it as no type filter.
import type { UseQueryResult } from '@tanstack/react-query';
import { useGetRequest } from '../../shared/hooks/useGetRequest';
import type { IInventoryItem, TItemType } from '../models/inventoryItem';

// * Named constants keep the query key prefix and endpoint URL in one place so
// * consumers that need to invalidate this query stay in sync with the hook.
export const INVENTORY_QUERY_KEY_PREFIX = 'inventory';
export const INVENTORY_URL = '/inventory';

export type TInventoryTypeFilter = TItemType | 'both';

export const useInventory = (
  locationId: string | null,
  type: TInventoryTypeFilter,
): UseQueryResult<IInventoryItem[], Error> => {
  return useGetRequest<IInventoryItem[]>({
    queryKey: [INVENTORY_QUERY_KEY_PREFIX, locationId, type],
    url: INVENTORY_URL,
    params: { locationId, type },
    enabled: locationId !== null,
  });
};

export default useInventory;
