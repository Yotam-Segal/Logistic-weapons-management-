import type { ReactNode } from 'react';
import { ButtonBase, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import type { TRole } from '../../models/role';

import styles from './roleButton.module.scss';

// * Props for the role-selection card used on the landing page.
// * `icon` is the role's leading glyph, `description` is the short
// * Hebrew tagline shown under the title.
interface IRoleButtonProps {
    role: TRole;
    label: string;
    description: string;
    icon: ReactNode;
    onSelect: (role: TRole) => void;
}

// * Role-selection card used by the RoleSelectorPage (Req 1.1).
// *
// * Renders as a large pill-shaped ButtonBase that carries a leading icon
// * tile, a stacked title + description block, and a trailing chevron —
// * matching the landing page design. All navigation/state side effects
// * live in the parent page so this component stays presentational.
const RoleButton = ({
    role,
    label,
    description,
    icon,
    onSelect,
}: IRoleButtonProps): JSX.Element => {
    const handleClick = (): void => {
        onSelect(role);
    };

    return (
        <ButtonBase
            className={styles.root}
            onClick={handleClick}
            focusRipple
            aria-label={label}
        >
            <span className={styles.iconTile}>{icon}</span>
            <span className={styles.text}>
                <Typography className={styles.label} component="span">
                    {label}
                </Typography>
                <Typography
                    className={styles.description}
                    component="span"
                    variant="body2"
                >
                    {description}
                </Typography>
            </span>
            <ChevronLeftIcon className={styles.chevron} fontSize="small" />
        </ButtonBase>
    );
};

export default RoleButton;
