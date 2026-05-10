import { ReactNode, useMemo } from 'react';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, Theme, createTheme } from '@mui/material';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

interface IThemeProviderProps {
    children: ReactNode;
}

// * Build a single Emotion cache tuned for RTL
const buildRtlCache = (): EmotionCache =>
    createCache({
        key: 'mui-rtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

// * Build the MUI theme with RTL direction
const buildTheme = (): Theme =>
    createTheme({
        direction: 'rtl',
        palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#9c27b0' },
        },
        typography: {
            fontFamily: "'Rubik', 'Heebo', 'Segoe UI', Arial, sans-serif",
        },
    });

const ThemeProvider = ({ children }: IThemeProviderProps): JSX.Element => {
    const rtlCache: EmotionCache = useMemo(buildRtlCache, []);
    const theme: Theme = useMemo(buildTheme, []);

    return (
        <CacheProvider value={rtlCache}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </CacheProvider>
    );
};

export default ThemeProvider;
