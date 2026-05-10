import { ReactNode } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';

interface IAppProvidersProps {
    children: ReactNode;
}

// * Composes every top-level provider in the order
// *   QueryClientProvider -> JotaiProvider -> ThemeProvider -> BrowserRouter
const AppProviders = ({ children }: IAppProvidersProps): JSX.Element => {
    return (
        <QueryProvider>
            <JotaiProvider>
                <ThemeProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                </ThemeProvider>
            </JotaiProvider>
        </QueryProvider>
    );
};

export default AppProviders;
