# Implementation Plan: Weapon Inventory Management

## Overview

Build the role-based SPA incrementally. Start with the app shell, providers, and shared primitives so every feature lands on a stable base. Then wire role and location state (the two atoms that drive everything downstream). Implement inventory next because it owns the "report issue" entry point that issues depend on, and finish with the issues feature, router wiring, and responsive verification.

All code is React 18 + TypeScript. MUI v5 is used with an RTL-configured Emotion cache. State is split between Jotai atoms (role, location, drawer UI) and TanStack Query v4 (inventory, issues). No `useEffect`, no `localStorage`. Components are thin — business logic lives in feature hooks. SCSS modules sit next to each component.

## Correctness Properties (derived from requirements)

The design document's "Correctness Properties" section is empty, so the following properties have been derived from the acceptance criteria and drive the property-based test tasks below.

- **Property 1: Status color map completeness.** For every `TItemStatus` and `TIssueStatus` value, `STATUS_COLOR_MAP[value]` is defined and non-empty. _Validates: Requirement 10.1_
- **Property 2: Status color map specific mappings.** Each status maps to its required color: `תקין→green`, `תקול→red`, `פג תוקף→orange`, `נדרש מטווח→purple`, `תקלה מחכה לתיאום→yellow`, `תיקון מחכה לאישור טכנאי→blue`, `תיקון תואם→teal`, `תקלה טופלה→gray`. _Validates: Requirements 10.2–10.9_
- **Property 3: Date formatting invariant.** For any `Date` input, `formatDate` returns a string matching `DD/MM/YYYY`. _Validates: Requirement 3.2_
- **Property 4: Inventory filter correctness.** For any list of items and filter value `f ∈ {weapon, sight, both}`, the filtered list contains only items where `item.type === f` when `f ≠ both`, and contains every input item when `f === both`. _Validates: Requirements 4.3, 4.4, 4.5_
- **Property 5: Inventory location scoping.** For any selected location `L` and any result returned by `useInventory(L, ...)`, every returned item satisfies `item.locationId === L`. _Validates: Requirements 2.2, 3.1_
- **Property 6: Issues location scoping.** For any selected location `L` and any result returned by `useIssues(L)`, every returned issue satisfies `issue.locationId === L`. _Validates: Requirements 2.2, 6.1, 8.1_
- **Property 7: Coordinate action transition.** The Coordinate action is exposed only when `issue.status === "תקלה מחכה לתיאום"`, and after it runs the issue's status equals `"תיקון תואם"`. _Validates: Requirements 7.2, 7.3_
- **Property 8: Resolve action transition.** For any issue, after `resolveIssue` runs, the issue's status equals `"תקלה טופלה"`, and any provided comment is persisted on the issue. _Validates: Requirement 9.3_
- **Property 9: Required-field validation on issue reporting.** For any form submission where `issueType` is missing, no issue is created and a validation message is surfaced; for any submission with a valid `issueType`, the created issue has `status === "תקלה מחכה לתיאום"` and `itemId` equal to the drawer's item. _Validates: Requirements 5.3, 5.4_

## Tasks

- [x] 1. Scaffold project and global providers
  - Create `src/` layout with `features/`, `providers/`, `router/`, `styles/` directories
  - Install and configure MUI v5, Emotion, `stylis-plugin-rtl`, Jotai, TanStack Query v4, React Router v6, Axios
  - Create `providers/QueryProvider.tsx` exposing a shared `QueryClient`
  - Create `providers/ThemeProvider.tsx` with an RTL-configured Emotion cache and MUI theme (`direction: 'rtl'`)
  - Create `providers/AppProviders.tsx` composing `QueryClientProvider`, Jotai `Provider`, `ThemeProvider`, and `BrowserRouter`
  - Wire `AppProviders` in `main.tsx` around `<App />`
  - _Requirements: 12.1_

- [x] 2. Implement shared data-layer hooks and axios instance
  - [x] 2.1 Create centralized axios instance under `features/shared/utils/httpClient.ts`
    - Read base URL from `window.__RUNTIME_CONFIG__`
    - Export a single configured instance
    - _Requirements: 3.1, 6.1, 8.1_

  - [x] 2.2 Implement `useGetRequest` in `features/shared/hooks/useGetRequest.ts`
    - Wrap TanStack Query `useQuery`, typed by response shape
    - Accept `{ queryKey, url, params, enabled }` and return `UseQueryResult`
    - _Requirements: 3.1, 6.1, 8.1_

  - [x] 2.3 Implement `useChangeRequest` in `features/shared/hooks/useChangeRequest.ts`
    - Wrap TanStack Query `useMutation` for POST/PUT/PATCH/DELETE
    - Accept `{ url, method, onSuccessInvalidate }` and auto-invalidate passed query keys
    - _Requirements: 5.3, 7.3, 9.3_

- [x] 3. Implement shared models, utilities, and the status color map
  - [x] 3.1 Define shared types in `features/shared/models/`
    - `TRole`, `TLocation`, `TId`
    - _Requirements: 1.1, 2.1_

  - [x] 3.2 Implement `formatDate` in `features/shared/utils/formatDate.ts`
    - Uses `toLocaleDateString('en-GB')` returning `DD/MM/YYYY`
    - Declared return type `string`
    - _Requirements: 3.2_

  - [x] 3.3 Implement `STATUS_COLOR_MAP` in `features/shared/utils/statusColorMap.ts`
    - Exhaustive `Record<TItemStatus | TIssueStatus, string>`
    - Include a `getStatusColor(status)` helper with a typed return
    - _Requirements: 10.1–10.9_

  - [ ]\* 3.4 Write property test for `STATUS_COLOR_MAP`
    - **Property 1: Status color map completeness** — every `TItemStatus` and `TIssueStatus` value has a non-empty entry in `STATUS_COLOR_MAP`
    - **Property 2: Status color map specific mappings** — exhaustive assertion per status/color pair
    - **Validates: Requirements 10.1–10.9**

  - [ ]\* 3.5 Write property test for `formatDate`
    - **Property 3: Date formatting invariant** — for any `Date`, output matches `^\d{2}/\d{2}/\d{4}$`
    - **Validates: Requirement 3.2**

- [x] 4. Implement shared UI components
  - [x] 4.1 Build `AppDrawer` in `features/shared/components/AppDrawer/`
    - MUI `Drawer` with RTL-aware anchor and close control
    - Props: `open`, `onClose`, `title`, `children`
    - `appDrawer.module.scss` handles responsive width (full-width on `xs`, fixed on `md+`)
    - _Requirements: 5.1, 5.6, 7.1, 9.1, 12.1_

  - [x] 4.2 Build `StatusChip` in `features/shared/components/StatusChip/`
    - Reads color from `STATUS_COLOR_MAP` using the status prop
    - Renders text and color together
    - _Requirements: 3.3, 6.2, 8.2, 10.1_

  - [x] 4.3 Build `EmptyState` in `features/shared/components/EmptyState/`
    - Default message `"לא נמצאו נתונים"`, overridable via prop
    - _Requirements: 2.4, 3.4, 6.3, 8.3_

  - [x] 4.4 Build `NotificationBanner` in `features/shared/components/NotificationBanner/`
    - Driven by React Query `isSuccess`/`isError` state passed in via props
    - MUI `Snackbar` + `Alert`, auto-hide on success
    - _Requirements: 5.5, 7.4, 9.4_

  - [ ]\* 4.5 Write unit tests for shared components
    - `EmptyState` renders default and custom message
    - `StatusChip` pulls color for every status value
    - _Requirements: 3.3, 3.4, 6.2, 6.3, 8.2, 8.3_

- [x] 5. Implement role feature
  - [x] 5.1 Define role models and atom
    - `features/role/models/role.ts` exports `TRole = 'rabashatz' | 'technician'`
    - `features/shared/stores/session.ts` exports `roleAtom = atom<TRole | null>(null)`
    - _Requirements: 1.2, 1.3_

  - [x] 5.2 Build `RoleSelectorPage` in `features/role/pages/RoleSelectorPage/`
    - Renders two `RoleButton` components (`"רבש״ץ"`, `"Technician"`)
    - On click, sets `roleAtom` and navigates (rabashatz → `/inventory`, technician → `/issues`) via `useNavigate`
    - _Requirements: 1.1, 1.2_

  - [x] 5.3 Build `RoleButton` in `features/role/components/RoleButton/`
    - Accepts `role: TRole`, `label: string`, `onSelect(role)`
    - _Requirements: 1.1_

  - [x] 5.4 Build `RoleIndicator` in `features/role/components/RoleIndicator/`
    - Reads `roleAtom` and displays current role label in header
    - Exposes a "Change Role" control that clears `roleAtom` and navigates to `/`
    - _Requirements: 1.3, 1.4_

- [x] 6. Implement location feature
  - [x] 6.1 Define location atom and mock locations
    - `features/shared/stores/session.ts` exports `locationAtom = atom<string | null>(null)`
    - `features/location/models/location.ts` exports `ILocation { id: string; name: string }`
    - `features/location/utils/mockLocations.ts` exports a small set of locations
    - _Requirements: 2.1, 2.3_

  - [x] 6.2 Build `LocationSelector` in `features/location/components/LocationSelector/`
    - MUI `Select` bound to `locationAtom`
    - Displays current location name; allows clearing
    - _Requirements: 2.1, 2.3_

  - [x] 6.3 Build `Header` in `features/shared/components/Header/`
    - Composes `LocationSelector` + `RoleIndicator` + "Change Role" control
    - Responsive: collapses controls on small screens via MUI breakpoints
    - _Requirements: 1.3, 1.4, 2.1, 12.1_

- [x] 7. Checkpoint - Shell, providers, and shared primitives
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement inventory feature
  - [x] 8.1 Define inventory models
    - `features/inventory/models/inventoryItem.ts` with `TItemType`, `TItemStatus`, `IInventoryItem`
    - _Requirements: 3.1, 4.1_

  - [x] 8.2 Create mock inventory dataset
    - `features/inventory/utils/mockInventory.ts` returns a seeded `IInventoryItem[]` covering both types and every `TItemStatus`, spread across at least two locations
    - _Requirements: 3.1, 4.3–4.5_

  - [x] 8.3 Implement `useInventory` hook
    - `features/inventory/hooks/useInventory.ts` wraps `useGetRequest`
    - Signature: `useInventory(locationId: string | null, type: TItemType | 'both')`
    - `enabled: locationId !== null`
    - Server-side (mock) filtering by `locationId`; returns items matching the selected type (or all when `both`)
    - _Requirements: 2.2, 2.4, 3.1, 4.3–4.5_

  - [ ]\* 8.4 Write property tests for `useInventory` filter and scoping
    - **Property 4: Inventory filter correctness** — for any generated dataset and filter value, the returned list respects the filter
    - **Property 5: Inventory location scoping** — every returned item has `locationId` equal to the requested location
    - **Validates: Requirements 2.2, 3.1, 4.3, 4.4, 4.5**

  - [x] 8.5 Build `InventoryFilter` in `features/inventory/components/InventoryFilter/`
    - MUI `ToggleButtonGroup` with values `weapon | sight | both`, default `both`
    - Controlled via prop; no internal persistence
    - _Requirements: 4.1, 4.2, 4.3–4.5_

  - [x] 8.6 Build `InventoryRow` in `features/inventory/components/InventoryRow/`
    - Shows `id`, `serialNumber`, `name`, `type`, `lastInspectionDate` (via `formatDate`), `status` (via `StatusChip`)
    - Calls `onOpen(item)` on click
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 8.7 Build `InventoryList` in `features/inventory/components/InventoryList/`
    - Receives `items` and `onOpen`; renders `InventoryRow` for each
    - Renders `EmptyState` when items is empty
    - _Requirements: 3.1, 3.4_

  - [x] 8.8 Build `ReportIssueForm` in `features/inventory/components/ReportIssueForm/`
    - MUI `Select` for `issueType` (required), `TextField` for comment (optional)
    - Client-side validation blocks submit when `issueType` is empty and surfaces a field-level error
    - Calls `onSubmit({ issueType, comment })` on valid submit
    - _Requirements: 5.2, 5.4_

  - [x] 8.9 Implement `useReportIssue` hook
    - `features/inventory/hooks/useReportIssue.ts` wraps `useChangeRequest`
    - POSTs `{ itemId, locationId, issueType, comment }`, sets new issue `status = "תקלה מחכה לתיאום"` server-side
    - Invalidates `['issues', locationId]`
    - _Requirements: 5.3_

  - [x] 8.10 Build `ItemDrawer` in `features/inventory/components/ItemDrawer/`
    - Wraps `AppDrawer`; renders item detail block + `ReportIssueForm`
    - On form submit, calls `useReportIssue` mutation
    - On `isSuccess`, shows `NotificationBanner` and closes the drawer
    - Close control triggers `onClose` without mutating
    - _Requirements: 5.1, 5.3, 5.5, 5.6_

  - [x] 8.11 Build `InventoryPage` in `features/inventory/pages/InventoryPage/`
    - Reads `locationAtom`; owns `typeFilter` local state (default `both`)
    - Calls `useInventory(locationId, typeFilter)`
    - Renders `InventoryFilter`, `InventoryList`, and `ItemDrawer` for the selected row
    - Shows `EmptyState` when `locationId` is null (Req 2.4) and when the list is empty (Req 3.4)
    - _Requirements: 2.2, 2.4, 3.1, 3.4, 4.1, 4.2_

  - [ ]\* 8.12 Write property test for `ReportIssueForm` validation and mutation payload
    - **Property 9: Required-field validation on issue reporting** — missing `issueType` prevents submission; valid input produces an issue payload with `status = "תקלה מחכה לתיאום"` and matching `itemId`
    - **Validates: Requirements 5.3, 5.4**

  - [ ]\* 8.13 Write unit tests for inventory rendering
    - `InventoryRow` formats date via `formatDate`
    - `InventoryPage` renders `EmptyState` when `locationAtom` is null
    - _Requirements: 2.4, 3.2, 3.4_

- [x] 9. Checkpoint - Inventory flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement issues feature
  - [x] 10.1 Define issue models
    - `features/issues/models/issue.ts` with `TIssueType`, `TIssueStatus`, `IIssue`, `IReportIssueInput`
    - _Requirements: 5.3, 6.1, 7.1, 9.1_

  - [x] 10.2 Create mock issues dataset and in-memory store
    - `features/issues/utils/mockIssues.ts` seeds issues across statuses and locations
    - Expose mock `create`, `coordinate`, `resolve` mutations that the axios mock adapter calls into
    - _Requirements: 6.1, 7.3, 8.1, 9.3_

  - [x] 10.3 Implement `useIssues` hook
    - `features/issues/hooks/useIssues.ts` wraps `useGetRequest`
    - Signature: `useIssues(locationId: string | null)`; `enabled: locationId !== null`
    - _Requirements: 2.2, 2.4, 6.1, 8.1_

  - [ ]\* 10.4 Write property test for `useIssues` location scoping
    - **Property 6: Issues location scoping** — every issue returned has `locationId` equal to the requested location
    - **Validates: Requirements 2.2, 6.1, 8.1**

  - [x] 10.5 Build `IssueRow` in `features/issues/components/IssueRow/`
    - Shows `id`, `itemId`, `issueType`, `status` (via `StatusChip`), `comment`
    - Calls `onOpen(issue)` on click
    - _Requirements: 6.1, 6.2, 8.1, 8.2_

  - [x] 10.6 Build `IssuesList` in `features/issues/components/IssuesList/`
    - Renders `IssueRow` for each issue; shows `EmptyState` when empty
    - _Requirements: 6.1, 6.3, 8.1, 8.3_

  - [x] 10.7 Implement `useCoordinateIssue` hook
    - `features/issues/hooks/useCoordinateIssue.ts` wraps `useChangeRequest`
    - PATCHes the issue; sets server-side status to `"תיקון תואם"`
    - Invalidates `['issues', locationId]`
    - _Requirements: 7.3, 7.4_

  - [x] 10.8 Build `CoordinateAction` in `features/issues/components/CoordinateAction/`
    - Renders a button that triggers `useCoordinateIssue`
    - Only mounted by `IssueDrawer` when role is `rabashatz` and `issue.status === "תקלה מחכה לתיאום"`
    - Shows success via `NotificationBanner` on `isSuccess`
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]\* 10.9 Write property test for Coordinate transition
    - **Property 7: Coordinate action transition** — action is exposed only for status `"תקלה מחכה לתיאום"` and produces `"תיקון תואם"` post-mutation
    - **Validates: Requirements 7.2, 7.3**

  - [x] 10.10 Implement `useResolveIssue` hook
    - `features/issues/hooks/useResolveIssue.ts` wraps `useChangeRequest`
    - PATCHes the issue with `{ comment? }`; sets server-side status to `"תקלה טופלה"` and persists comment
    - Invalidates `['issues', locationId]`
    - _Requirements: 9.3, 9.4_

  - [x] 10.11 Build `ResolveAction` in `features/issues/components/ResolveAction/`
    - Renders optional comment `TextField` + "Mark Resolved" button
    - Only mounted by `IssueDrawer` when role is `technician`
    - Shows success via `NotificationBanner` on `isSuccess`
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]\* 10.12 Write property test for Resolve transition
    - **Property 8: Resolve action transition** — post-mutation status is `"תקלה טופלה"` and any provided comment is persisted
    - **Validates: Requirement 9.3**

  - [x] 10.13 Build `IssueDrawer` in `features/issues/components/IssueDrawer/`
    - Wraps `AppDrawer`; reads `roleAtom`
    - Renders issue detail block + the appropriate action component by role and status
    - On mutation success, closes itself and triggers the parent refresh (via query invalidation)
    - _Requirements: 7.1, 7.2, 9.1, 9.2_

  - [x] 10.14 Build `IssuesPage` in `features/issues/pages/IssuesPage/`
    - Reads `locationAtom` and `roleAtom`
    - Calls `useIssues(locationId)`
    - Renders `IssuesList` + `IssueDrawer` for the selected row
    - Shows `EmptyState` when `locationId` is null and when the list is empty
    - _Requirements: 2.2, 2.4, 6.1, 6.3, 8.1, 8.3_

  - [ ]\* 10.15 Write unit tests for issues rendering
    - `IssueDrawer` mounts `CoordinateAction` only for rabashatz + `"תקלה מחכה לתיאום"`
    - `IssueDrawer` mounts `ResolveAction` only for technician
    - _Requirements: 7.2, 9.2, 11.1, 11.2_

- [x] 11. Implement router and role-based layout
  - [x] 11.1 Define routes in `router/routes.tsx`
    - Lazy-load `RoleSelectorPage`, `InventoryPage`, `IssuesPage` via `React.lazy`
    - Wrap lazy components in `<Suspense>` with a lightweight fallback
    - Routes: `/` → `RoleSelectorPage`, `/inventory` → `InventoryPage`, `/issues` → `IssuesPage`
    - _Requirements: 1.1, 1.2_

  - [x] 11.2 Build `RoleGate` in `router/RoleGate.tsx`
    - Reads `roleAtom`; redirects to `/` via `<Navigate>` when `null`
    - Wraps the protected subtree
    - _Requirements: 1.1, 1.2_

  - [x] 11.3 Build `MainLayout` in `features/shared/components/MainLayout/`
    - Renders `Header`, role-based `TabsNav`, and `<Outlet />`
    - `TabsNav`: when role is `rabashatz` shows Inventory + Issues tabs; when role is `technician` shows only Issues tab (InventoryTab hidden)
    - Tabs use `<Link>` / `useNavigate`
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 11.4 Wire `App.tsx` to render routes through providers and `RoleGate`
    - `<AppProviders>` → `<Routes>` with `/` public and everything else under `<RoleGate><MainLayout />`
    - _Requirements: 1.1, 1.2, 11.1, 11.2, 11.3_

- [x] 12. Responsive layout verification
  - [x] 12.1 Apply MUI breakpoints and SCSS media queries across `Header`, `AppDrawer`, `InventoryList`, `IssuesList`, `InventoryFilter`
    - Ensure list rows stack or truncate appropriately on `xs`
    - Drawer becomes full-width on `xs`, fixed on `md+`
    - _Requirements: 12.1_

  - [ ]\* 12.2 Write responsive layout tests
    - Snapshot or layout assertions at `xs` and `md` breakpoints for `Header`, `AppDrawer`, `InventoryList`
    - _Requirements: 12.1_

- [x] 13. Final checkpoint - Full flow
  - Ensure all tests pass, ask the user if questions arise.
  - Manually verify in `npm run dev`: role selection → location selection → inventory filtering → report issue → coordinate issue → resolve issue, on both desktop and mobile viewports.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP. Core implementation tasks are never optional.
- Each task references specific sub-requirements for traceability.
- Property-based tests validate the nine correctness properties derived above; unit tests cover specific examples and edge cases.
- Checkpoints are placed after the app shell, after the inventory flow, and at the end to catch integration problems early.
- No `useEffect` or `localStorage` usage anywhere; React Query callbacks, Jotai atoms, and derived values carry all side-effect work.
