import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import Header from '../Header/Header';
import TabsNav from '../TabsNav/TabsNav';

import styles from './mainLayout.module.scss';

// * Authenticated app shell composed of three stacked regions (Req 11.1-11.3):
// *   1. `<Header />`   — brand, LocationSelector, RoleIndicator.
// *   2. `<Outlet />`   — active page. Each page owns its own chrome (hero,
// *                       padding, etc.) so the layout stays deliberately thin.
// *   3. `<TabsNav />`  — fixed bottom navigation bar (see tabsNav.module.scss).
// *
// * `.content` reserves bottom padding equal to the tab bar's height plus the
// * safe-area inset so page content never scrolls behind the bar.
const MainLayout = (): JSX.Element => {
    return (
        <Box className={styles.layout} component="div">
            <Header />
            <Box className={styles.content} component="main">
                <Outlet />
            </Box>
            <TabsNav />
        </Box>
    );
};

export default MainLayout;
