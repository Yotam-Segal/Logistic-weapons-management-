import type { TIssueStatus, TItemStatus } from '../models';

// * Centralized mapping from item/issue status values to display colors
// * (Req 10.1–10.9). Hex values chosen to match the landing-page design
// * — vivid, accessible-on-white, and tonally matched across the palette.
export const STATUS_COLOR_MAP: Record<TItemStatus | TIssueStatus, string> = {
  תקין: '#12b76a', // green
  תקול: '#f04438', // red
  'פג תוקף': '#f79009', // orange
  'נדרש מטווח': '#9e77ed', // purple
  'תקלה מחכה לתיאום': '#eab308', // yellow
  'תיקון מחכה לאישור טכנאי': '#2e90fa', // blue
  'תיקון תואם': '#15b79e', // teal
  'תקלה טופלה': '#667085', // gray
};

// * Returns the display color associated with a given item or issue status.
// @param status - the status value to look up
export const getStatusColor = (status: TItemStatus | TIssueStatus): string =>
  STATUS_COLOR_MAP[status];
