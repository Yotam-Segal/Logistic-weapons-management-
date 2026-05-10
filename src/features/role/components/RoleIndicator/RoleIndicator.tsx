import { Box, Button, Typography } from '@mui/material';
import { useAtom } from 'jotai';

import { roleAtom } from '../../../shared/stores/session';
import useChangeRole from '../../hooks/useChangeRole';
import { ROLE_LABEL_MAP } from '../../utils/roleLabels';

import styles from './roleIndicator.module.scss';

// * Header indicator showing the active role alongside a control that
// * returns the user to the Role_Selector (Req 1.3, 1.4). Reads the
// * current role from the shared roleAtom; renders nothing when no
// * role is selected so the indicator stays absent on the entry screen.
const RoleIndicator = (): JSX.Element | null => {
    const [role] = useAtom(roleAtom);
    const { changeRole } = useChangeRole();

    if (role === null) {
        return null;
    }

    return (
        <Box className={styles.root} component="div">
            <Typography className={styles.label} component="span" variant="body2">
                {ROLE_LABEL_MAP[role]}
            </Typography>
            <Button
                className={styles.changeButton}
                variant="text"
                size="small"
                onClick={changeRole}
            >
                החלף תפקיד
            </Button>
        </Box>
    );
};

export default RoleIndicator;
