# Tech Stack

## Core

- React 18 with TypeScript
- Vite build system
- PWA support (vite-plugin-pwa)

## UI Framework

- MUI (Material-UI) v5
- Emotion for styled components
- SCSS modules for component styles
- RTL support via stylis-plugin-rtl
- Responsive design: must work on all phone types and computer screens
- Use MUI breakpoints or CSS media queries for responsiveness

## State Management

- Jotai for global state
- TanStack Query (React Query) v4 for server state
- Avoid `useEffect` - prefer React Query callbacks, event handlers, or derived state
- Avoid `localStorage` and `sessionStorage` - use server state or Jotai atoms

## Data Fetching

- Custom hooks wrapping TanStack React Query
- `useGetRequest` for GET requests
- `useChangeRequest` for mutations (POST/PUT/DELETE)

## User Feedback

- Show success/fail popups for major user actions (create, save, edit, delete)
- Use React Query states (`isSuccess`, `isError`) to control popup visibility
- Use generic popup components from `features/shared/components/`
- Designated popups for specific flows when needed
- Display empty state indication when requests return no data (e.g., "לא נמצאו נתונים" for empty lists)

## Routing

- React Router v6 (react-router-dom)
- Pages are lazy-loaded via `React.lazy()` in route definitions
- Use `<Link>` and `useNavigate` for internal navigation (never `<a href>`)

## HTTP Client

- Axios with centralized instance

## Date Handling

- Use native JavaScript `Date` object
- All date visualization must use `en-GB` format (DD/MM/YYYY)

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Environment

- Runtime config via `window.__RUNTIME_CONFIG__`
- Environment files in `/env` directory
- Google Analytics integration

## Code Style

- ESLint with TypeScript rules
- Prettier formatting:
  - Single quotes
  - 2-space indentation
  - Trailing commas
  - Semicolons required

## Comment Formatting (Better Comments)

Use these comment prefixes for clarity:

- `// *` - Highlighted/important information
- `// !` - Alerts and warnings
- `// ?` - Questions or needs clarification
- `// TODO:` - Tasks to complete
- `// @param` - Parameter documentation
