import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { roleAtom } from '../../shared/stores/session';

// * Shape of the value returned by useChangeRole.
interface IUseChangeRoleResult {
  changeRole: () => void;
}

// * Encapsulates the "change role" side effect exposed by RoleIndicator
// * (Req 1.4). Clears the stored role in session state and navigates
// * back to the Role_Selector entry screen so the user can pick again.
//
// * Keeping this logic in a hook follows the project rule that all
// * business logic lives outside components.
const useChangeRole = (): IUseChangeRoleResult => {
  const setRole = useSetAtom(roleAtom);
  const navigate = useNavigate();

  const changeRole = (): void => {
    setRole(null);
    navigate('/');
  };

  return { changeRole };
};

export default useChangeRole;
