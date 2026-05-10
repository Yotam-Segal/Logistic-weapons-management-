import AppRoutes from './router/routes';

// * Root app component. AppProviders is applied in main.tsx, so this
// * component just renders the route tree defined in router/routes.tsx.
const App = (): JSX.Element => {
    return <AppRoutes />;
};

export default App;
