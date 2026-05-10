import type { TRole } from '../models/role';

// * Hebrew display labels for each selectable role (Req 1.1, 1.3).
// * Centralized so RoleSelectorPage and RoleIndicator share the same copy.
export const ROLE_LABEL_MAP: Record<TRole, string> = {
  rabashatz: 'רבש״ץ',
  technician: 'טכנאי (נשק)',
};

// * Short descriptions shown under each role title on the role-selection
// * cards. Not used by the header indicator — only the landing page cards
// * render these (Req 1.1).
export const ROLE_DESCRIPTION_MAP: Record<TRole, string> = {
  rabashatz: 'מלאי, תקלות ופיקוח',
  technician: 'טיפולים ותחזוקה בשטח',
};
