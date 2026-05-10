import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { roleAtom } from '../../shared/stores/session';
import type { TRole } from '../models/role';

// * Maps each selectable role to its landing route after selection.
// * rabashatz → inventory view (Req 1.2, 3.1)
// * technician → issues view (Req 1.2, 8.1)
const ROLE_ROUTE_MAP: Record<TRole, string> = {
  rabashatz: '/inventory',
  technician: '/issues',
};

// * Shape of the value returned by useRoleSelection.
interface IUseRoleSelectionResult {
  selectRole: (role: TRole) => void;
}

// * Encapsulates the role selection side effects triggered by the
// * RoleSelectorPage (Req 1.1, 1.2). Writes the chosen role into the
// * shared roleAtom via useSetAtom (write-only, no read needed) and
// * navigates to the role's landing page using react-router-dom.
//
// * Keeping this logic in a hook follows the project rule that all
// * business logic lives outside components so the page body stays thin.
const useRoleSelection = (): IUseRoleSelectionResult => {
  const setRole = useSetAtom(roleAtom);
  const navigate = useNavigate();

  const selectRole = (role: TRole): void => {
    setRole(role);
    navigate(ROLE_ROUTE_MAP[role]);
  };

  return { selectRole };
};

export default useRoleSelection;
