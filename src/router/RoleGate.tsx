import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';

import { roleAtom } from '../features/shared/stores/session';

// * Props contract for the role-based route guard.
// * `children` is optional so the guard can be used either as a direct
// * wrapper (`<RoleGate><MainLayout /></RoleGate>`) or as a nested-route
// * element that defers rendering to React Router's <Outlet />.
interface IRoleGateProps {
    children?: ReactNode;
}

// * Route guard that blocks access to any protected subtree until a role
// * has been selected (Req 1.1, 1.2). Reads the current role from the
// * shared roleAtom; when no role is set it redirects back to the Role
// * Selector at `/` using a replace navigation so the blocked URL does
// * not linger in the history stack.
const RoleGate = ({ children }: IRoleGateProps): JSX.Element => {
    const role = useAtomValue(roleAtom);

    if (role === null) {
        return <Navigate to="/" replace />;
    }

    return <>{children ?? <Outlet />}</>;
};

export default RoleGate;
