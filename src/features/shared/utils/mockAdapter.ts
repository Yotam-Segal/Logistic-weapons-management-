// * Module-scoped axios mock adapter bound to the shared httpClient.
// * Feature-specific mock handlers (inventory, issues, ...) register routes
// * against this single instance. Unhandled routes will 404 intentionally so
// * missing mocks surface immediately during development.
import MockAdapter from 'axios-mock-adapter';
import { httpClient } from './httpClient';
import { registerInventoryMocks } from '../../inventory/utils/mockInventory';
import { registerIssuesMocks } from '../../issues/utils/mockIssues';

export const mockAdapter: MockAdapter = new MockAdapter(httpClient);

export const registerMockHandlers = (): void => {
  registerInventoryMocks();
  registerIssuesMocks();
};
