import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import RoleGate from './RoleGate';
import MainLayout from '../features/shared/components/MainLayout/MainLayout';

// * Lazy-loaded page components so each route's bundle is split (tech.md:
// * "Pages are lazy-loaded via React.lazy() in route definitions").
// * Each target module's default export is the page component, matching
// * React.lazy's contract.
const RoleSelectorPage = lazy(
    () => import('../features/role/pages/RoleSelectorPage/RoleSelectorPage'),
);
const InventoryPage = lazy(
    () => import('../features/inventory/pages/InventoryPage/InventoryPage'),
);
const IssuesPage = lazy(() => import('../features/issues/pages/IssuesPage/IssuesPage'));

// * Lightweight, role-agnostic fallback rendered while a lazy route chunk
// * resolves. Centered spinner keeps the shell stable between navigations.
const RouteFallback = (): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40vh',
            }}
        >
            <CircularProgress aria-label="loading" />
        </Box>
    );
};

// * Top-level route map for the SPA (Req 1.1, 1.2, 11.1-11.3).
// *
// * Structure:
// *   - `/` → RoleSelectorPage (public, Req 1.1)
// *   - Everything else is nested under <RoleGate> (redirects to `/` when
// *     no role is set) and <MainLayout /> (renders Header + role-based
// *     TabsNav + <Outlet />):
// *       - `/inventory` → InventoryPage
// *       - `/issues`    → IssuesPage
// *
// * The nested-route form lets <RoleGate> and <MainLayout> mount once and
// * share their <Outlet /> across protected pages without each route having
// * to re-declare the guard or the layout.
// *
// * A single top-level <Suspense> wraps the whole <Routes> so the fallback
// * handles any pending lazy chunk without each route needing its own.
const AppRoutes = (): JSX.Element => {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route path="/" element={<RoleSelectorPage />} />
                <Route element={<RoleGate />}>
                    <Route element={<MainLayout />}>
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/issues" element={<IssuesPage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
