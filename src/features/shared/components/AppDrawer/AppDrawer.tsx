import { ReactNode } from 'react';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import styles from './appDrawer.module.scss';

// * Props for the shared AppDrawer wrapper
interface IAppDrawerProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

// * MUI Drawer with an RTL-aware anchor and a titled header with a close control.
// * Because the MUI theme is configured with direction: 'rtl', anchor="left"
// * is automatically flipped to render on the right, matching Hebrew reading order.
const AppDrawer = ({ open, onClose, title, children }: IAppDrawerProps): JSX.Element => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{ className: styles.drawerPaper }}
        >
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    size="small"
                    edge="end"
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={styles.body}>{children}</div>
        </Drawer>
    );
};

export default AppDrawer;
