import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

interface IQueryProviderProps {
    children: ReactNode;
}

const QueryProvider = ({ children }: IQueryProviderProps): JSX.Element => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
