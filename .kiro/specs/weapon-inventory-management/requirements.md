# Requirements Document

## Introduction

The Weapon Inventory & Issue Management System is a role-based Single Page Application (SPA) for managing weapon inventory and maintenance workflows. The system supports two roles (רבש״ץ - Weapon Storage Manager, and Technician) and scopes all data by a selected location. The initial phase uses mock data without backend authentication beyond role selection. The system enables inventory viewing, filtering, issue reporting, issue coordination, and issue resolution through a clean drawer-based UI.

## Glossary

- **System**: The Weapon Inventory & Issue Management SPA
- **Rabashatz_User**: A user with the role "רבש״ץ" (Weapon Storage Manager) responsible for reporting issues and coordinating repairs
- **Technician_User**: A user with the role "Technician" responsible for resolving reported issues
- **Inventory_Item**: A weapon or sight in the inventory with id, serialNumber, name, type, lastInspectionDate, and status
- **Issue**: A reported problem on an inventory item with id, itemId, issueType, status, and optional comment
- **Location**: A physical scope identifier that filters inventory and issues
- **Role_Selector**: The entry screen component for selecting a user role
- **Location_Selector**: The top-bar component for selecting the active location
- **Inventory_View**: The page listing inventory items for the Rabashatz_User
- **Inventory_Filter**: The segmented control for filtering by item type (weapon, sight, or both)
- **Item_Drawer**: The side panel showing item details and issue reporting form
- **Issues_View**: The page listing issues
- **Issue_Drawer**: The side panel showing issue details and available actions
- **Issue_Status**: One of: "תקלה מחכה לתיאום", "תיקון מחכה לאישור טכנאי", "תיקון תואם", "תקלה טופלה"
- **Item_Status**: One of: "תקין", "תקול", "פג תוקף", "נדרש מטווח"
- **Issue_Type**: One of: "מעצור חולץ", "שבר בפין פציל", "קנה שחוק", "בעיית דריכה", "ידית דריכה תקועה", "בעיית הזנה", "חלק חסר", "אחר"
- **Status_Color_Map**: The centralized mapping from status values to display colors

## Requirements

### Requirement 1: Role Selection

**User Story:** As a first-time user, I want to select my role on entry, so that the system presents the correct workflow for me.

#### Acceptance Criteria

1. WHEN the application loads with no role stored, THE System SHALL display the Role_Selector screen with exactly two options: "רבש״ץ" and "Technician"
2. WHEN a user clicks a role button on the Role_Selector, THE System SHALL store the selected role in global state and navigate to the main layout
3. WHILE a role is stored in global state, THE System SHALL display the selected role in the header as a role indicator
4. WHERE the user has selected a role, THE System SHALL provide a mechanism to change the role and return to the Role_Selector

### Requirement 2: Location Selection

**User Story:** As a user, I want to select a location from the top bar, so that I see only data relevant to that location.

#### Acceptance Criteria

1. THE System SHALL display the Location_Selector as a dropdown in the header on every page after role selection
2. WHEN a user changes the selected location, THE System SHALL refresh the Inventory_View and Issues_View to display only data scoped to the new location
3. WHILE a location is selected, THE System SHALL display the location name in the Location_Selector
4. IF no location is selected, THEN THE System SHALL display an empty state in the Inventory_View and Issues_View indicating that a location must be selected

### Requirement 3: Inventory Viewing (Rabashatz)

**User Story:** As a Rabashatz_User, I want to view all inventory items for the selected location, so that I can monitor their status.

#### Acceptance Criteria

1. WHILE the Rabashatz_User is on the Inventory_View, THE System SHALL display all Inventory_Items scoped to the selected location showing id, serialNumber, name, type, lastInspectionDate, and status
2. THE System SHALL format lastInspectionDate using the en-GB format (DD/MM/YYYY)
3. THE System SHALL display each Inventory_Item's status with both text and a distinct color from the Status_Color_Map
4. IF the Inventory_View returns no items for the selected location, THEN THE System SHALL display an empty-state indication with the text "לא נמצאו נתונים"

### Requirement 4: Inventory Filtering

**User Story:** As a Rabashatz_User, I want to filter inventory by type, so that I can focus on weapons, sights, or both.

#### Acceptance Criteria

1. THE System SHALL display a segmented control with options "Weapons", "Sights", and "Both" on the Inventory_View
2. THE System SHALL default the Inventory_Filter selection to "Both" on initial load of the Inventory_View
3. WHEN the Rabashatz_User selects the "Weapons" option, THE System SHALL display only Inventory_Items where type equals "weapon"
4. WHEN the Rabashatz_User selects the "Sights" option, THE System SHALL display only Inventory_Items where type equals "sight"
5. WHEN the Rabashatz_User selects the "Both" option, THE System SHALL display all Inventory_Items regardless of type

### Requirement 5: Item Details and Issue Reporting

**User Story:** As a Rabashatz_User, I want to open an item and report an issue, so that maintenance can be coordinated.

#### Acceptance Criteria

1. WHEN the Rabashatz_User clicks an Inventory_Item, THE System SHALL open the Item_Drawer displaying the item's id, serialNumber, name, type, lastInspectionDate, and status
2. THE Item_Drawer SHALL display an issue reporting form with an Issue_Type selector and an optional comment field
3. WHEN the Rabashatz_User submits the issue form with a selected Issue_Type, THE System SHALL create a new Issue with status "תקלה מחכה לתיאום" linked to the item via itemId
4. IF the Rabashatz_User submits the issue form without selecting an Issue_Type, THEN THE System SHALL prevent submission and display a validation message identifying the missing field
5. WHEN an issue is successfully created, THE System SHALL display a success notification and close the Item_Drawer
6. WHEN the Rabashatz_User clicks the close control on the Item_Drawer, THE System SHALL close the Item_Drawer without creating an issue

### Requirement 6: Issues Viewing (Rabashatz)

**User Story:** As a Rabashatz_User, I want to view issues I have reported, so that I can track their progress.

#### Acceptance Criteria

1. WHILE the Rabashatz_User is on the Issues_View, THE System SHALL display all Issues scoped to the selected location showing id, itemId, issueType, status, and comment
2. THE System SHALL display each Issue's status with both text and a distinct color from the Status_Color_Map
3. IF the Issues_View returns no issues for the selected location, THEN THE System SHALL display an empty-state indication with the text "לא נמצאו נתונים"

### Requirement 7: Issue Coordination (Rabashatz)

**User Story:** As a Rabashatz_User, I want to coordinate a technician for an issue, so that the repair process can begin.

#### Acceptance Criteria

1. WHEN the Rabashatz_User clicks an Issue in the Issues_View, THE System SHALL open the Issue_Drawer displaying the Issue's id, itemId, issueType, status, and comment
2. WHILE the Issue_Drawer is open for an Issue with status "תקלה מחכה לתיאום", THE System SHALL display a "Coordinate Technician" action control
3. WHEN the Rabashatz_User activates the "Coordinate Technician" action, THE System SHALL update the Issue's status to "תיקון תואם"
4. WHEN the Issue status is successfully updated, THE System SHALL display a success notification and refresh the Issues_View

### Requirement 8: Issues Viewing (Technician)

**User Story:** As a Technician_User, I want to view all open issues regardless of creator, so that I can pick up work to resolve.

#### Acceptance Criteria

1. WHILE the Technician_User is on the Issues_View, THE System SHALL display all Issues scoped to the selected location showing id, itemId, issueType, status, and comment
2. THE System SHALL display each Issue's status with both text and a distinct color from the Status_Color_Map
3. IF the Issues_View returns no issues for the selected location, THEN THE System SHALL display an empty-state indication with the text "לא נמצאו נתונים"

### Requirement 9: Issue Resolution (Technician)

**User Story:** As a Technician_User, I want to mark an issue as resolved and add a comment, so that the record reflects completion.

#### Acceptance Criteria

1. WHEN the Technician_User clicks an Issue in the Issues_View, THE System SHALL open the Issue_Drawer displaying the Issue's id, itemId, issueType, status, and comment
2. WHILE the Issue_Drawer is open for the Technician_User, THE System SHALL display a "Mark Resolved" action control and an optional comment input
3. WHEN the Technician_User activates the "Mark Resolved" action, THE System SHALL update the Issue's status to "תקלה טופלה" and persist any entered comment
4. WHEN the Issue status is successfully updated, THE System SHALL display a success notification and refresh the Issues_View

### Requirement 10: Status Color Mapping

**User Story:** As any user, I want consistent color coding for statuses across the app, so that I can quickly recognize states visually.

#### Acceptance Criteria

1. THE System SHALL centralize a Status_Color_Map covering all Item_Status values and Issue_Status values
2. THE System SHALL display status "תקין" with a green color
3. THE System SHALL display status "תקול" with a red color
4. THE System SHALL display status "פג תוקף" with an orange color
5. THE System SHALL display status "נדרש מטווח" with a purple color
6. THE System SHALL display status "תקלה מחכה לתיאום" with a yellow color
7. THE System SHALL display status "תיקון מחכה לאישור טכנאי" with a blue color
8. THE System SHALL display status "תיקון תואם" with a teal color
9. THE System SHALL display status "תקלה טופלה" with a gray color

### Requirement 11: Tab Visibility by Role

**User Story:** As a user, I want to see only the tabs relevant to my role, so that the interface stays focused.

#### Acceptance Criteria

1. WHERE the selected role is Rabashatz_User, THE System SHALL display the InventoryTab and the IssuesTab in the main layout
2. WHERE the selected role is Technician_User, THE System SHALL display the TechnicianIssuesTab in the main layout
3. WHERE the selected role is Technician_User, THE System SHALL NOT display the InventoryTab

### Requirement 12: Responsive Layout

**User Story:** As a user on any device, I want the layout to adapt to my screen, so that I can work on desktop or mobile.
