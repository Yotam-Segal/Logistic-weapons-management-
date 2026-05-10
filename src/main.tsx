import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProviders from './providers/AppProviders';
import App from './App';
import { registerMockHandlers } from './features/shared/utils/mockAdapter';
import './styles/global.scss';

registerMockHandlers();

const rootElement: HTMLElement | null = document.getElementById('root');

if (rootElement === null) {
    throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </React.StrictMode>,
);
