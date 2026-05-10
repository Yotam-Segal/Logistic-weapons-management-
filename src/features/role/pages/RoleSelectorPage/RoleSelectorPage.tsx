import { Box, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';

import RoleButton from '../../components/RoleButton/RoleButton';
import useRoleSelection from '../../hooks/useRoleSelection';
import type { TRole } from '../../models/role';
import { ROLE_DESCRIPTION_MAP, ROLE_LABEL_MAP } from '../../utils/roleLabels';

import styles from './roleSelectorPage.module.scss';

// * Explicit order for the role buttons on the selection screen.
const ROLE_OPTIONS: readonly TRole[] = ['rabashatz', 'technician'] as const;

// * Leading icon rendered in each role card's icon tile.
// * Kept beside the labels so copy/icon changes stay in one place.
const ROLE_ICON_MAP: Record<TRole, JSX.Element> = {
    rabashatz: <ShieldOutlinedIcon fontSize="small" />,
    technician: <BuildOutlinedIcon fontSize="small" />,
};

// * Branding and footer copy shown on the landing card.
const BRAND_NAME: string = 'Webponse';
const SUBTITLE: string = 'מערכת שליטה - בחר סביבת עבודה';
const FOOTER_TAGLINE: string = 'SECURE SYSTEM V2.4 - AUTHORIZED PERSONNEL ONLY';

// * Role selection entry screen (Req 1.1, 1.2).
// *
// * Renders the two role choices as a centered card with a branded header
// * and a footer tagline — matching the landing-page design. All side
// * effects (atom write + navigation) are delegated to `useRoleSelection`
// * so the component body stays thin.
const RoleSelectorPage = (): JSX.Element => {
    const { selectRole } = useRoleSelection();

    return (
        <Box className={styles.root} component="main">
            <Box className={styles.card} component="section">
                <Box className={styles.brand}>
                    <Box className={styles.brandIcon} aria-hidden>
                        <GpsFixedIcon />
                    </Box>
                    <Typography className={styles.brandName} component="h1">
                        {BRAND_NAME}
                    </Typography>
                    <Typography className={styles.subtitle} component="p">
                        {SUBTITLE}
                    </Typography>
                </Box>

                <Box className={styles.buttons}>
                    {ROLE_OPTIONS.map((role: TRole) => (
                        <RoleButton
                            key={role}
                            role={role}
                            label={ROLE_LABEL_MAP[role]}
                            description={ROLE_DESCRIPTION_MAP[role]}
                            icon={ROLE_ICON_MAP[role]}
                            onSelect={selectRole}
                        />
                    ))}
                </Box>
            </Box>

            <Typography className={styles.footer} component="p">
                {FOOTER_TAGLINE}
            </Typography>
        </Box>
    );
};

export default RoleSelectorPage;
