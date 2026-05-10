import type { ILocation } from '../models/location';

// * Seeded in-memory locations used while the app runs against mock data (Req 2.1, 2.3).
export const MOCK_LOCATIONS: readonly ILocation[] = [
  { id: 'loc-south', name: 'מחנה הדרומי' },
  { id: 'loc-center', name: 'בסיס מרכז' },
  { id: 'loc-north', name: 'בסיס צפון' },
];
