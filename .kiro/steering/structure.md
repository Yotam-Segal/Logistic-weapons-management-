# Project Structure

```
src/
├── assets/          # Static assets (fonts, icons, images)
├── features/        # All feature modules
│   ├── {feature}/   # Domain-specific features
│   └── shared/      # Global/generic shared code
├── providers/       # React context providers
├── router/          # Routing configuration
└── styles/          # Global styles and variables
```

## Feature Module Pattern

Every feature (including `shared`) follows this structure:

```
features/{feature-name}/
├── components/      # Feature-specific components
├── hooks/           # Feature-specific hooks (API calls)
├── models/          # Feature-specific types/interfaces
├── pages/           # Feature page components
├── utils/           # Feature-specific utilities
└── stores/          # Feature-specific state atoms
```

## Shared Feature

`features/shared/` contains global and generic code used across multiple features:

- Reusable UI components (buttons, cards, inputs)
- Common hooks (useGetRequest, useChangeRequest, useDebounce)
- Shared models and types
- Utility functions
- Global state atoms

## Component Organization

- Each component in its own folder
- SCSS module alongside component: `component.module.scss`
- Component file: `component.tsx`

## Naming Conventions

- Components: PascalCase (`GeneralItemCard.tsx`)
- Hooks: camelCase with `use` prefix (`useGetRequest.ts`)
- Styles: camelCase with `.module.scss` suffix
- Models/Types/Utils: camelCase (`material.ts`)
- Interfaces start with the initial I, types with the initial T (`IMaterial`, `TMaterial`)
- Enums and global constants: SCREAMING_SNAKE_CASE (`COUNT_STATUS`)
- Variables should contain full words, not abbreviations (`index` instead of `i`)
- Variables should declare their types (`const amount: number;`)
- Functions should declare their return types

## API Hooks Pattern

- GET requests: Use `useGetRequest` wrapper from `features/shared/hooks/`
- Mutations (POST/PUT/DELETE): Use `useChangeRequest` wrapper from `features/shared/hooks/`
- Feature-specific hooks in `features/{name}/hooks/`

## Component Design Principles (S.O.L.I.D)

- Single Responsibility: Each component does one thing well
- Open/Closed: Extend via props/composition, not modification
- Liskov Substitution: Child components must be substitutable for parent abstractions
- Interface Segregation: Props interfaces should be minimal and focused
- Dependency Inversion: Components depend on abstractions (hooks, contexts), not implementations

## Component Rules

- Keep components small and focused on a single logical unit
- Extract all business logic into custom hooks
- Component body should only contain:
  - Hook calls
  - Derived/computed values (simple transformations)
  - JSX return
- No inline logic, API calls, or complex computations in component body
- Extract calculations to named constants, don't perform them inline
- Use composition over inheritance
- Split large components into smaller sub-components
- The component will be exported as default
