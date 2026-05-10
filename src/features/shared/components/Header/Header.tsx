import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import LocationSelector from '../../../location/components/LocationSelector/LocationSelector';
import RoleIndicator from '../../../role/components/RoleIndicator/RoleIndicator';

import styles from './header.module.scss';

// * Brand label displayed on the right side of the header in RTL.
const APP_TITLE: string = 'מערכת ניהול נשק';

// * Top-bar shell composing the app brand with the two session controls
// * required on every authenticated screen: LocationSelector (Req 2.1) and
// * RoleIndicator (Req 1.3, 1.4) — the latter already owns the "Change Role"
// * button, so the header never renders a duplicate control.
// *
// * Responsive behavior (Req 12.1):
// *   - xs: title and controls wrap onto separate lines; controls stretch to
// *     full width inside the toolbar so the location dropdown stays usable on
// *     narrow screens. Implemented via MUI's sx breakpoint API + SCSS module.
// *   - md+: everything sits on a single toolbar row with the title on the
// *     reading-order start (right in RTL) and the controls grouped at the end.
const Header = (): JSX.Element => {
    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar
                className={styles.toolbar}
                sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    gap: { xs: 1, md: 2 },
                }}
            >
                <Typography className={styles.title} component="h1" variant="h6" noWrap>
                    {APP_TITLE}
                </Typography>
                <Box
                    className={styles.controls}
                    sx={{
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', md: 'auto' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                    }}
                >
                    <LocationSelector />
                    <RoleIndicator />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
