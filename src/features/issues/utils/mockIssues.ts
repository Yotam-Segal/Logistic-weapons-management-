// * Seeded issues dataset and mock HTTP handlers used while the app runs
// * without a real backend (Req 6.1, 7.3, 8.1, 9.3). When a real API becomes
// * available the handlers here disappear and the UI stays unchanged.
import type { AxiosRequestConfig } from 'axios';
import type { IIssue, IReportIssueInput, TIssueStatus } from '../models/issue';
import { mockAdapter } from '../../shared/utils/mockAdapter';

interface IIssuesQueryParams {
  locationId?: string;
}

interface IResolveIssuePayload {
  comment?: string;
}

const REPORTED_STATUS: TIssueStatus = 'תקלה מחכה לתיאום';
const COORDINATED_STATUS: TIssueStatus = 'תיקון תואם';
const RESOLVED_STATUS: TIssueStatus = 'תקלה טופלה';

const COORDINATE_URL_PATTERN: RegExp = /^\/issues\/[^/]+\/coordinate$/;
const RESOLVE_URL_PATTERN: RegExp = /^\/issues\/[^/]+\/resolve$/;
const ISSUE_ID_CAPTURE: RegExp = /^\/issues\/([^/]+)\//;

// * Seed covers every TIssueStatus value many times over and spans all three
// * locations so list/filter/badge flows have meaningful volume during
// * development (Req 6.1, 8.1). Linked item ids match entries in
// * INITIAL_MOCK_INVENTORY so drawers rendering "item X" still resolve.
export const INITIAL_MOCK_ISSUES: readonly IIssue[] = [
  // --- loc-south ---------------------------------------------------------
  {
    id: 'issue-001',
    itemId: 'inv-001',
    locationId: 'loc-south',
    issueType: 'מעצור חולץ',
    status: 'תקלה מחכה לתיאום',
    createdAt: new Date('2026-11-05T08:15:00'),
    updatedAt: new Date('2026-11-05T08:15:00'),
  },
  {
    id: 'issue-002',
    itemId: 'inv-002',
    locationId: 'loc-south',
    issueType: 'בעיית דריכה',
    status: 'תיקון תואם',
    createdAt: new Date('2026-10-22T10:00:00'),
    updatedAt: new Date('2026-10-28T09:30:00'),
  },
  {
    id: 'issue-003',
    itemId: 'inv-003',
    locationId: 'loc-south',
    issueType: 'קנה שחוק',
    status: 'תקלה טופלה',
    comment: 'הוחלף קנה חדש ונבדק במטווח',
    createdAt: new Date('2026-09-12T12:45:00'),
    updatedAt: new Date('2026-09-20T16:10:00'),
  },
  {
    id: 'issue-007',
    itemId: 'inv-011',
    locationId: 'loc-south',
    issueType: 'ידית דריכה תקועה',
    status: 'תיקון מחכה לאישור טכנאי',
    comment: 'ממתין לאישור החלפת קפיץ',
    createdAt: new Date('2026-10-30T07:50:00'),
    updatedAt: new Date('2026-11-02T09:15:00'),
  },
  {
    id: 'issue-008',
    itemId: 'inv-014',
    locationId: 'loc-south',
    issueType: 'חלק חסר',
    status: 'תקלה מחכה לתיאום',
    comment: 'חסר מגב שמן',
    createdAt: new Date('2026-11-12T13:20:00'),
    updatedAt: new Date('2026-11-12T13:20:00'),
  },
  {
    id: 'issue-009',
    itemId: 'inv-016',
    locationId: 'loc-south',
    issueType: 'אחר',
    status: 'תיקון תואם',
    comment: 'זומן לטיפול מונע',
    createdAt: new Date('2026-10-15T11:00:00'),
    updatedAt: new Date('2026-10-25T10:40:00'),
  },
  {
    id: 'issue-010',
    itemId: 'inv-017',
    locationId: 'loc-south',
    issueType: 'בעיית הזנה',
    status: 'תקלה טופלה',
    comment: 'הוחלף מחסנית פגומה',
    createdAt: new Date('2026-08-04T09:00:00'),
    updatedAt: new Date('2026-08-09T15:30:00'),
  },

  // --- loc-center --------------------------------------------------------
  {
    id: 'issue-004',
    itemId: 'inv-005',
    locationId: 'loc-center',
    issueType: 'בעיית הזנה',
    status: 'תיקון מחכה לאישור טכנאי',
    createdAt: new Date('2026-11-01T07:30:00'),
    updatedAt: new Date('2026-11-03T14:20:00'),
  },
  {
    id: 'issue-005',
    itemId: 'inv-006',
    locationId: 'loc-center',
    issueType: 'ידית דריכה תקועה',
    status: 'תקלה מחכה לתיאום',
    comment: 'הידית לא זזה כלל',
    createdAt: new Date('2026-11-10T11:05:00'),
    updatedAt: new Date('2026-11-10T11:05:00'),
  },
  {
    id: 'issue-006',
    itemId: 'inv-007',
    locationId: 'loc-center',
    issueType: 'חלק חסר',
    status: 'תקלה טופלה',
    comment: 'הותקן חלק חלופי מהמחסן',
    createdAt: new Date('2026-08-18T09:00:00'),
    updatedAt: new Date('2026-08-25T13:40:00'),
  },
  {
    id: 'issue-011',
    itemId: 'inv-023',
    locationId: 'loc-center',
    issueType: 'שבר בפין פציל',
    status: 'תקלה מחכה לתיאום',
    comment: 'פין פציל נשבר במהלך פירוק',
    createdAt: new Date('2026-11-08T10:30:00'),
    updatedAt: new Date('2026-11-08T10:30:00'),
  },
  {
    id: 'issue-012',
    itemId: 'inv-024',
    locationId: 'loc-center',
    issueType: 'קנה שחוק',
    status: 'תיקון תואם',
    createdAt: new Date('2026-10-20T08:45:00'),
    updatedAt: new Date('2026-10-27T14:10:00'),
  },
  {
    id: 'issue-013',
    itemId: 'inv-025',
    locationId: 'loc-center',
    issueType: 'אחר',
    status: 'תיקון מחכה לאישור טכנאי',
    comment: 'בדיקת זיהוי עצמי של המכוון',
    createdAt: new Date('2026-11-04T12:00:00'),
    updatedAt: new Date('2026-11-06T09:20:00'),
  },
  {
    id: 'issue-014',
    itemId: 'inv-026',
    locationId: 'loc-center',
    issueType: 'בעיית דריכה',
    status: 'תקלה טופלה',
    comment: 'פורק, נוקה והורכב מחדש',
    createdAt: new Date('2026-07-14T07:30:00'),
    updatedAt: new Date('2026-07-18T16:00:00'),
  },

  // --- loc-north ---------------------------------------------------------
  {
    id: 'issue-015',
    itemId: 'inv-009',
    locationId: 'loc-north',
    issueType: 'מעצור חולץ',
    status: 'תקלה מחכה לתיאום',
    comment: 'מעצור חולץ מתרחש כל 3-4 יריות',
    createdAt: new Date('2026-11-14T09:10:00'),
    updatedAt: new Date('2026-11-14T09:10:00'),
  },
  {
    id: 'issue-016',
    itemId: 'inv-010',
    locationId: 'loc-north',
    issueType: 'אחר',
    status: 'תיקון מחכה לאישור טכנאי',
    comment: 'סוללת הליזר אינה מחזיקה טעינה',
    createdAt: new Date('2026-11-03T08:25:00'),
    updatedAt: new Date('2026-11-07T10:55:00'),
  },
  {
    id: 'issue-017',
    itemId: 'inv-028',
    locationId: 'loc-north',
    issueType: 'קנה שחוק',
    status: 'תיקון תואם',
    comment: 'תואם טכנאי ליום שלישי הבא',
    createdAt: new Date('2026-10-12T13:45:00'),
    updatedAt: new Date('2026-10-22T15:00:00'),
  },
  {
    id: 'issue-018',
    itemId: 'inv-030',
    locationId: 'loc-north',
    issueType: 'חלק חסר',
    status: 'תקלה טופלה',
    comment: 'הוחזר בורג מכסה עליון',
    createdAt: new Date('2026-06-05T10:00:00'),
    updatedAt: new Date('2026-06-08T14:30:00'),
  },
  {
    id: 'issue-019',
    itemId: 'inv-032',
    locationId: 'loc-north',
    issueType: 'אחר',
    status: 'תקלה מחכה לתיאום',
    comment: 'נקודת האדום רועדת בקור',
    createdAt: new Date('2026-11-13T07:15:00'),
    updatedAt: new Date('2026-11-13T07:15:00'),
  },
  {
    id: 'issue-020',
    itemId: 'inv-033',
    locationId: 'loc-north',
    issueType: 'בעיית הזנה',
    status: 'תיקון תואם',
    comment: 'תואם למטווח טכני מחר',
    createdAt: new Date('2026-10-28T09:40:00'),
    updatedAt: new Date('2026-11-01T12:10:00'),
  },
  {
    id: 'issue-021',
    itemId: 'inv-034',
    locationId: 'loc-north',
    issueType: 'אחר',
    status: 'תקלה טופלה',
    comment: 'כייל מחדש לאחר נפילה',
    createdAt: new Date('2025-10-30T11:30:00'),
    updatedAt: new Date('2025-11-05T16:45:00'),
  },
];

// * Module-scoped mutable store. POST/PATCH handlers mutate this array so the
// * mock layer behaves like a stateful backend across a user session.
const issuesStore: IIssue[] = [...INITIAL_MOCK_ISSUES];

const generateIssueId = (): string => {
  const randomSuffix: string = Math.random().toString(36).slice(2, 6);
  return `issue-${Date.now()}-${randomSuffix}`;
};

const listIssuesByLocation = (locationId: string | undefined): IIssue[] => {
  if (locationId === undefined) {
    return [...issuesStore];
  }

  return issuesStore.filter((issue: IIssue): boolean => issue.locationId === locationId);
};

const createIssue = (input: IReportIssueInput): IIssue => {
  const now: Date = new Date();
  const newIssue: IIssue = {
    id: generateIssueId(),
    itemId: input.itemId,
    locationId: input.locationId,
    issueType: input.issueType,
    status: REPORTED_STATUS,
    comment: input.comment,
    createdAt: now,
    updatedAt: now,
  };

  issuesStore.push(newIssue);
  return newIssue;
};

const findIssueIndexById = (issueId: string): number => {
  return issuesStore.findIndex((issue: IIssue): boolean => issue.id === issueId);
};

const coordinateIssue = (issueId: string): IIssue | null => {
  const index: number = findIssueIndexById(issueId);
  if (index === -1) {
    return null;
  }

  const current: IIssue = issuesStore[index];
  const updated: IIssue = {
    ...current,
    status: COORDINATED_STATUS,
    updatedAt: new Date(),
  };

  issuesStore[index] = updated;
  return updated;
};

const resolveIssueById = (issueId: string, payload: IResolveIssuePayload): IIssue | null => {
  const index: number = findIssueIndexById(issueId);
  if (index === -1) {
    return null;
  }

  const current: IIssue = issuesStore[index];
  const updated: IIssue = {
    ...current,
    status: RESOLVED_STATUS,
    comment: payload.comment ?? current.comment,
    updatedAt: new Date(),
  };

  issuesStore[index] = updated;
  return updated;
};

const extractIssueIdFromUrl = (url: string | undefined): string | null => {
  if (url === undefined) {
    return null;
  }

  const match: RegExpMatchArray | null = url.match(ISSUE_ID_CAPTURE);
  return match ? match[1] : null;
};

const parseReportIssueBody = (rawBody: string | undefined): IReportIssueInput => {
  return JSON.parse(rawBody ?? '{}') as IReportIssueInput;
};

const parseResolveIssueBody = (rawBody: string | undefined): IResolveIssuePayload => {
  return JSON.parse(rawBody ?? '{}') as IResolveIssuePayload;
};

type TIssueResponse = [number, IIssue] | [number, { message: string }];

const handleGetIssues = (config: AxiosRequestConfig): [number, IIssue[]] => {
  const params: IIssuesQueryParams = (config.params ?? {}) as IIssuesQueryParams;
  const filtered: IIssue[] = listIssuesByLocation(params.locationId);
  return [200, filtered];
};

const handleCreateIssue = (config: AxiosRequestConfig): [number, IIssue] => {
  const input: IReportIssueInput = parseReportIssueBody(config.data);
  const created: IIssue = createIssue(input);
  return [201, created];
};

const handleCoordinateIssue = (config: AxiosRequestConfig): TIssueResponse => {
  const issueId: string | null = extractIssueIdFromUrl(config.url);
  if (issueId === null) {
    return [404, { message: 'Issue not found' }];
  }

  const updated: IIssue | null = coordinateIssue(issueId);
  if (updated === null) {
    return [404, { message: 'Issue not found' }];
  }

  return [200, updated];
};

const handleResolveIssue = (config: AxiosRequestConfig): TIssueResponse => {
  const issueId: string | null = extractIssueIdFromUrl(config.url);
  if (issueId === null) {
    return [404, { message: 'Issue not found' }];
  }

  const payload: IResolveIssuePayload = parseResolveIssueBody(config.data);
  const updated: IIssue | null = resolveIssueById(issueId, payload);
  if (updated === null) {
    return [404, { message: 'Issue not found' }];
  }

  return [200, updated];
};

export const registerIssuesMocks = (): void => {
  mockAdapter.onGet('/issues').reply(handleGetIssues);
  mockAdapter.onPost('/issues').reply(handleCreateIssue);
  mockAdapter.onPatch(COORDINATE_URL_PATTERN).reply(handleCoordinateIssue);
  mockAdapter.onPatch(RESOLVE_URL_PATTERN).reply(handleResolveIssue);
};
