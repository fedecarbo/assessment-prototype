# Build Log

Quick reference for architecture and context - what exists and where to find it.

---

## Project Foundation

**Tech Stack:** Next.js 15 + TypeScript (strict) + Tailwind v4 + Shadcn UI
**Design System:** GDS blue (#1d70b8), GDS black (#0b0c0c), 5px spacing base, 1100px max-width
**Mock Data:** Type-safe schemas in [lib/mock-data/schemas](lib/mock-data/schemas/index.ts)

---

## Routes & Pages

### `/application/[id]` - Application Detail
**Layout:** Collapsing hero (550px interactive map) + sticky scrollspy navigation
**Architecture:** IntersectionObserver for scrollspy, 7 sections with smooth scroll
**Key Components:** ApplicationDetailLayout, ApplicationSections, ApplicationStatusBadges
**Sections:** Overview (66/33 split), Timeline (4 stages), Documents, Constraints, Site history, Consultees, Neighbours

### `/application/[id]/assessment` - Assessment Workflow
**Layout:** Full-width, full-height flexbox with independent scrolling
**Architecture:** URL-driven state (`?task=X`), dual context (current/future versions), TaskPanel 370px fixed
**Desktop:** TaskPanel (370px) + Content (flex-1, max-w-readable 723px)
**Mobile:** Conditional rendering - TaskPanel OR Content based on selectedTaskId
**Key Components:** AssessmentLayout, TaskPanel (version switcher), AssessmentContext, FutureAssessmentContext
**Version System:** NEXT_PUBLIC_TASK_PANEL_VERSION env var toggles current (grouped tasks) vs future (linear + actions)

### `/application/[id]/assessment/requests/new` - Create Request
**Purpose:** Create new applicant request for additional information/documents
**Layout:** Full-width assessment layout with form constrained to 723px
**Architecture:** Form validation → navigation back to requests list (task 999)
**Key Components:** CreateRequestContent

### `/application/[id]/assessment/requests/[requestId]` - Request Detail
**Purpose:** View applicant request details and response
**Layout:** Full-width assessment layout with content constrained to 723px
**Architecture:** Displays request, response (if any), and attachments
**Key Components:** RequestDetailContent

### `/application/[id]/manage` - Service Management
**Purpose:** Add/track additional services mid-assessment
**Architecture:** Form state → ServiceRecord creation → Audit trail
**Key Components:** ManageApplicationContent

### `/application/[id]/information` - Application Information
**Layout:** Full viewport tabbed navigation (6 tabs), opens in new tab
**Architecture:** Conditional layout per tab - Constraints full-width (sidebar + map), others 1100px centered
**Tabs:** Overview, Documents (search + filters), Constraints (Leaflet map), Consultees, Neighbours, Site history
**Key Components:** ApplicationInfoLayout, MapView (Leaflet), DocumentsTable, ConstraintsTable

### `/` - Home (Pre-applications List)
**Layout:** SiteHeader + tabbed list with search/filters
**Architecture:** Client-side filtering (tabs + search + accordion filters)
**Tabs:** Assigned to you (default), Unassigned, All cases, Closed
**Tables:** StandardApplicationsTable (5 cols) vs ClosedApplicationsTable (5 cols with outcome)

---

## Key Architecture Patterns

### State Management
- **Assessment Context:** React Context with URL synchronization, taskMap for O(1) lookups
- **Version Switching:** localStorage + env var, full page reload on toggle
- **Service Management:** ServiceRecord audit trail with status tracking

### Layout Systems
- **Constrained width:** 1100px max-width (Application Detail, Home, most tabs)
- **Full width:** Assessment page, Constraints tab with sidebar (370px) + map (flex-1)
- **Two-column:** 66/33 split (Overview sections), 370px + flex-1 (Assessment)
- **Responsive:** Single column mobile → side-by-side 1024px+

### Navigation Patterns
- **Scrollspy:** IntersectionObserver with thresholds, sticky condensed header
- **Breadcrumbs:** Variants (constrained/full) with underline hover states
- **Tabs:** GDS pattern - active tab merges borders with content area
- **URL-driven:** Query params for task selection, maintains deep linking

### Component Variants
- **SiteHeader:** constrained (1100px) | full (no max-width)
- **Breadcrumbs:** constrained | full
- **CaseSummaryHeader:** default (with quick links) | info (without quick links)
- **TaskPanel:** current version (grouped) | future version (linear + actions)

---

## Schema Architecture

**Planning Application:** status, outcome, requestedServices, serviceRecords, totalServiceCost, propertyBoundary (GeoJSON), parish, ward, uprn, paymentReference
**Stage Workflows:** ValidationStage, ConsultationStage, AssessmentStage, ReviewStage (each with tasks array)
**Documents:** category, tags[], visibility (public/sensitive), version
**Constraints:** type, label, status, geometry (GeoJSON bounds)
**Consultees:** position, responseDate, type (internal/external), commentCount
**Neighbours:** position, topics[], response text
**Service Records:** service, status (included/added/removed), cost, addedDate, addedBy, notes

---

## Design System

**Colors:** GDS blue `hsl(211 66% 41%)` (#1d70b8), GDS black `hsl(0 0% 5%)` (#0b0c0c)
**Typography:** Base 1.188rem/1.563rem
**Spacing:** 5px base unit (p-4 = 20px)
**Layout:** 1100px max-width, 66/33 two-column, 370px TaskPanel, 723px readable content

---

## Map Integration

**Component:** MapView (Leaflet-based, dynamic import with SSR disabled)
**Features:** OpenStreetMap tiles, constraint overlays (colored rectangles), property boundaries (red dashed)
**Usage:** ApplicationDetailLayout (property boundary only), ApplicationInfoConstraints (constraints with toggles)
**Data:** GeoJSON format - coordinates [lng, lat], property geometries in [property-geometries.ts](lib/mock-data/property-geometries.ts)

---

## Applicant Requests System

**Location:** Within Assessment page (special task ID 999)
**Purpose:** Officers can send requests to applicants for additional information or documents, track responses
**Architecture:** Subpage-based navigation - list view → create form or detail view
**Key Components:** ApplicantRequestsContent, CreateRequestContent, RequestDetailContent
**Routes:** `/assessment/requests/new` (create), `/assessment/requests/[requestId]` (detail)

### Request States
- **pending:** Awaiting applicant response (blue badge)
- **responded:** Applicant has replied (green badge)
- **overdue:** Past due date without response (red badge, auto-detected)

### Task Panel Integration
- Shows pending request count: "Applicant requests (3)"
- "New" badge appears when unread responses exist
- Clicking link switches main content area to show requests (task ID 999)
- Count shows pending responses (actionable items for officer)
- Works in both current and future task panel versions

### Data Flow
- Officers create requests with subject, description, optional due date
- Each request tracks: sent date, sent by, status, optional response
- Responses include: message, received date, optional attachments
- `viewedByOfficer` flag tracks if response has been reviewed
- Auto-calculates overdue status based on due date vs today

---

## Action Item Breadcrumb Integration

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Dynamic Breadcrumbs for Non-Linear Actions

Added breadcrumb support for action items in the Task Panel, so when users navigate to non-linear actions (like "Applicant requests", "Activity", etc.), the breadcrumb trail reflects their location.

**Implementation:**

1. **Action Items Metadata** - Created [lib/action-items.ts](lib/action-items.ts)
   - Centralized definition of all action items with IDs, labels, and hrefs
   - Helper functions: `getActionItemById()`, `isActionItem()`
   - Action items: Activity (998), Fees and services (997), Meetings (996), Site visits (995), Applicant requests (999), Notes (994)

2. **Dynamic Breadcrumbs** - Updated [components/shared/assessment-layout.tsx](components/shared/assessment-layout.tsx)
   - Breadcrumbs now check if selected task is an action item
   - Automatically appends action label to breadcrumb trail
   - Example: "Home > Application Details > Check and assess > Applicant requests"

3. **Refactored Task Panel Actions** - Updated [components/shared/task-panel.tsx](components/shared/task-panel.tsx)
   - Replaced hardcoded action links with `ACTION_ITEMS.map()`
   - Maintains existing functionality (counts, badges, click handlers)
   - Single source of truth for action item configuration

**User Experience:**
- Clicking "Applicant requests" now shows: `Home > Application Details > Check and assess > Applicant requests`
- Same pattern applies to all action items (Activity, Meetings, Site visits, etc.)
- Breadcrumbs remain consistent across both current and future task panel versions
- Clear navigation context for non-linear workflow sections

**Files Modified:**
- [lib/action-items.ts](lib/action-items.ts) - NEW: Action items configuration
- [components/shared/assessment-layout.tsx](components/shared/assessment-layout.tsx:13,54-59) - Import and breadcrumb logic
- [components/shared/task-panel.tsx](components/shared/task-panel.tsx:23,291-318) - Use ACTION_ITEMS array

**Badge Style Update:**
- Changed "New" badge from `light-blue` variant to `green` variant (GDS blue #1d70b8 with white text)
- Matches the completed task badge style for visual consistency
- Updated in [components/shared/task-panel.tsx](components/shared/task-panel.tsx:315)

**Task Status Icon Refinement:**
- Reduced border radius on all task status icons from 6px to 4px for sharper, more refined appearance
- Applied to all status variants: locked, completed, in-progress, needs-review, not-started
- Updated in [components/shared/task-panel.tsx](components/shared/task-panel.tsx:67,111,145,184,224)

**Badge Spacing Optimization:**
- Refined badge padding for better text alignment and visual balance
- **Default size**: 8px left/right, 2px top, 3px bottom
- **Small size**: 8px left/right, 1px top/bottom
- Provides more compact appearance while maintaining readability
- Updated in [components/ui/badge.tsx](components/ui/badge.tsx:47-49)

**Applicant Requests Layout Refinement:**
- Aligned spacing with task pages for visual consistency across assessment workflow
- Title to description: `mt-3` (12px) - matches task pattern
- Description to separator: `mt-6` (24px) - matches task pattern
- Separator to content: `mt-6` (24px) - matches task pattern
- Button to table: 10px (`space-y-[10px]`) - compact spacing
- **Table cell vertical padding: 20px total (`py-[10px]`)** - 10px top + 10px bottom per cell
- **Button alignment: Left-aligned** instead of right-aligned for consistency with task actions
- **Link font weight: Regular** (removed `font-medium`) for cleaner, less heavy appearance
- Updated in [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:28,40,43,65,67,91,95,106,109,112)

**Applicant Requests Timeline Layout:**
**Date:** 2025-11-06
**Agent:** Forge (Builder)

Transformed applicant requests from table layout to timeline view with date grouping.

**Changes Made:**

1. **Timeline Structure:**
   - Requests grouped by sent date with date headers
   - Sorted newest first (descending order)
   - Each date section displays formatted date (e.g., "25 Mar 2024")
   - Card-based layout replaces table structure

2. **Request Cards:**
   - Bordered cards with hover effect (border-muted-foreground/30)
   - 20px padding (p-5) for comfortable spacing
   - Subject as large clickable link (text-lg font-bold)
   - Status badge positioned top-right
   - "New" badge for unread responses (blue badge with white text)

3. **Card Content:**
   - Header: Subject link + New badge (left) | Status badge (right)
   - Metadata row: "Sent by {name}" • "Due {date}" • "{type}"
   - Response indicator: Border-top section showing received date and attachment count
   - All metadata uses small text (text-sm) with muted foreground

4. **Spacing:**
   - Between date groups: 32px (space-y-8)
   - Date header to cards: 16px (mb-4)
   - Between cards in same date: 16px (space-y-4)
   - Button to timeline: 24px (space-y-6)

5. **Data Processing:**
   - New `groupRequestsByDate()` helper function
   - Groups requests by sentDate using Map
   - Returns array of [date, requests[]] tuples
   - Removed table components (Table, TableHeader, TableBody, TableCell)

**Visual Result:**
- Chronological narrative of communication with applicant
- Date headers provide temporal context
- Card format allows richer metadata display
- Response information integrated inline (not separate column)
- Better visual hierarchy with cards vs. table rows
- Hover states provide interactive feedback

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:1-171) - Complete restructure to timeline layout

**Applicant Requests Journey Redesign:**
**Date:** 2025-11-06
**Agent:** Forge (Builder)

Simplified applicant requests page to title and description only, removing all content implementation for journey redesign.

**Changes Made:**

1. **Simplified ApplicantRequestsContent:**
   - Removed all timeline/table content display
   - Removed all buttons and action links
   - Removed empty state handling
   - Now shows only: Title + Description + Separator
   - Ready for new journey implementation

2. **Removed Pages:**
   - Deleted `/app/application/[id]/assessment/requests/new/` - Create request page
   - Deleted `/app/application/[id]/assessment/requests/[requestId]/` - Request detail page

3. **Removed Components:**
   - Deleted `components/shared/create-request-content.tsx`
   - Deleted `components/shared/request-detail-content.tsx`

**Remaining Structure:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx) - Simplified to title/description shell
- Mock data and schemas remain in place for future implementation
- Task panel integration (count, badge, link) unchanged

**Purpose:**
Clean slate for redesigning the applicant requests user journey and interaction patterns.

---

## Key Files Reference

**Layouts:**
- [application-detail-layout.tsx](components/shared/application-detail-layout.tsx)
- [assessment-layout.tsx](components/shared/assessment-layout.tsx)
- [application-sections.tsx](components/shared/application-sections.tsx)

**Headers:**
- [site-header.tsx](components/shared/site-header.tsx)
- [case-summary-header.tsx](components/shared/case-summary-header.tsx)
- [breadcrumbs.tsx](components/shared/breadcrumbs.tsx)

**Assessment:**
- [task-panel.tsx](components/shared/task-panel.tsx)
- [assessment-context.tsx](components/shared/assessment-context.tsx)
- [future-assessment-context.tsx](components/shared/future-assessment-context.tsx)
- [assessment-content.tsx](components/shared/assessment-content.tsx)
- [future-assessment-content.tsx](components/shared/future-assessment-content.tsx)

**Data Display:**
- [documents-table.tsx](components/shared/documents-table.tsx)
- [constraints-table.tsx](components/shared/constraints-table.tsx)
- [consultation-statistics.tsx](components/shared/consultation-statistics.tsx)
- [application-status-badges.tsx](components/shared/application-status-badges.tsx)

**Applicant Requests:**
- [applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx) - Title/description shell only (journey redesign in progress)

**Map:**
- [map-view.tsx](components/shared/map-view.tsx)

**Data:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
- [lib/mock-data/applicant-requests.ts](lib/mock-data/applicant-requests.ts)
- [lib/mock-data/property-geometries.ts](lib/mock-data/property-geometries.ts)

**Utilities:**
- [lib/utils.ts](lib/utils.ts) - formatDate, calculateResponseRate, truncateToWords, formatTopicLabel, document helpers
- [lib/task-utils.tsx](lib/task-utils.tsx) - getStatusBadge, getRequestStatusBadge

**Config:**
- [tailwind.config.ts](tailwind.config.ts) - Design tokens (task-panel, content, readable widths, custom spacing)
- [app/globals.css](app/globals.css) - Theme variables

---

## Design System Enhancement - Dark Mode Badge Colors

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Dark Mode Badge Optimization

Added comprehensive dark mode support for all badge/tag color variants in [app/globals.css](app/globals.css).

**Design Principles Applied:**
- Sufficient contrast against dark backgrounds (WCAG AA minimum)
- Reduced brightness to prevent eye strain in dark mode
- Maintained color identity while adapting to dark theme
- Enhanced visibility for critical states (red/orange)
- Balanced saturation for informational states (blue/green)

**Badge Variants - Dark Mode:**
- **Grey:** Subtle neutral state (#d4d4d5 on #2a2a2b)
- **Green:** Success/completed with vibrant presence (#b8e0d2 on #0f5132)
- **Turquoise:** Informational with clarity (#9de4e8 on #164447)
- **Blue:** Primary informational (#aad3f0 on #1e4460)
- **Light Blue:** Subtle informational (#c5e2f5 on #223d54)
- **Purple:** Special/featured state (#d9ccec on #3d2560)
- **Pink:** Highlighted/flagged (#f0c8dc on #6e2550)
- **Red:** Critical/urgent with strong visibility (#f0c8c8 on #6e2525)
- **Orange:** Warning with warmth (#fdd8be on #854a26)
- **Yellow:** Attention/pending with clarity (#f5eba8 on #6b5f0f)

**Components Affected:**
- All badge components throughout the application
- Applicant request status badges (Pending, Responded, Overdue)
- Task status badges (Completed, In progress, Needs review, Not started, Locked)
- Document category badges
- Constraint type badges

**Location:** [app/globals.css](app/globals.css) lines 49-88 (.dark section)

---

## Button Style Enhancement - Dark Mode & Secondary Button

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Secondary Button & Shadow Optimization

Fixed secondary button styling to use proper neutral grey colors (not greenish tint) and added dark mode shadow support.

**Changes Made:**

1. **Button Shadows:**
   - Moved shadow from base class to variant-specific
   - Default (green) button: Light mode shadow `rgb(0,45,24)`, dark mode shadow `rgb(0,30,16)`
   - Secondary (grey) button: Light mode shadow `rgb(50,50,51)`, dark mode shadow `rgb(20,20,21)`

2. **Secondary Color Refinement:**
   - **Light mode:** Changed from bluish grey `210 40% 96.1%` to neutral grey `0 0% 93%` (#ededed)
   - **Dark mode:** Increased from `0 0% 14%` to `0 0% 25%` (#404040) for better visibility
   - Maintains proper contrast ratios for accessibility
   - Follows GOV.UK Design System pattern for secondary actions

**Files Modified:**
- [components/ui/button.tsx](components/ui/button.tsx:7-21) - Separated shadow per variant with dark mode support
- [app/globals.css](app/globals.css:13,37) - Updated secondary color values for light and dark modes

**Visual Result:**
- "Save draft" buttons now display with proper dark grey appearance
- Shadows adapt appropriately to light/dark themes
- No greenish tint on secondary buttons
- Better visual hierarchy between primary and secondary actions

---

## Task Status Reset - All Tasks 'Not Started'

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Task Panel Status Update

Reset all tasks to 'not-started' status for clean initial state.

**Changes Made:**

1. **Current Version Tasks ([assessment-context.tsx](components/shared/assessment-context.tsx)):**
   - Task 2 (Check consultees consulted): `needs-review` → `not-started`
   - Task 6 (Site description): `needs-review` → `not-started`
   - Task 8 (Summary of advice): `locked` → `not-started`
   - Task 10 (Check and add requirements): `locked` → `not-started`
   - Task 11 (Review and submit): `locked` → `not-started`

2. **Future Version Tasks ([future-assessment-context.tsx](components/shared/future-assessment-context.tsx)):**
   - Already set to `not-started` (no changes needed)

**Result:**
- All 11 tasks in current version now show as 'not-started'
- All 14 tasks in future version remain 'not-started'
- Clean slate for testing task progression and status changes
- Unlock logic remains intact (will still unlock tasks when dependencies complete)

**Files Modified:**
- [components/shared/assessment-context.tsx](components/shared/assessment-context.tsx:50,84,96,113,119) - Reset task statuses

---

## Applicant Requests - Card-Based List View

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Request List with Card Layout

Implemented card-based list view for applicant requests with full request details and status tracking.

**Changes Made:**

1. **Request Cards Layout:**
   - Card component with hover effect (border-muted-foreground/30)
   - 20px padding (p-5) for comfortable spacing
   - 16px spacing between cards (space-y-4)
   - Subject as heading (text-lg font-bold)
   - Status badge positioned top-right

2. **Card Content Structure:**
   - Header: Subject (left) + Status badge (right)
   - Description: Full request details with leading-relaxed
   - Metadata row: "Sent by {name}" • "Sent {date}" • "Due {date}" • "{type}"
   - All dates formatted as "25 Mar 2024" (UK format)
   - Request type shown capitalized (information, document, general)

3. **Response Section:**
   - Border-top separator when response exists
   - "Response received" label with "New" badge for unviewed responses
   - Response date and attachment count
   - Blue "New" badge (small size) for unread officer responses
   - Attachment count: "2 attachments" or "1 attachment"

4. **Action Button:**
   - "New request" button positioned below separator
   - 24px spacing between button and cards list (mt-6)
   - Left-aligned within max-w-readable

5. **Empty State:**
   - Message: "No requests have been sent yet."
   - Small muted text styling

6. **Data Integration:**
   - Reads from `application.applicantRequests` array
   - Uses `getRequestStatusBadge()` helper from task-utils
   - Status badges: Pending (blue), Responded (green), Overdue (red)
   - Handles optional fields: dueDate, response, attachments

**Visual Result:**
- Clean card-based layout with clear information hierarchy
- Subject prominence for quick scanning
- Status visibility at a glance
- Response indicators with "New" badge for actionable items
- Consistent spacing with assessment workflow patterns
- Hover states provide interactive feedback

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:1-111) - Complete card layout implementation

**Visual Refinement - Sharp Corners and Grey Borders:**
**Date:** 2025-11-06
**Agent:** Forge (Builder)

Refined card styling for cleaner, more professional appearance:
- **Border radius:** Removed (rounded-none) for sharp, clean corners
- **Border color:** Changed to grey (border-border) from default
- **Hover state:** Border darkens to muted-foreground on hover

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:59) - Card styling update

**Request Status Update and Title Sizing:**
**Date:** 2025-11-06
**Agent:** Forge (Builder)

Updated request statuses and refined typography:

1. **New Status Values:**
   - Replaced: 'pending', 'overdue' → 'sent', 'not-sent-yet', 'closed'
   - Kept: 'responded'
   - Status badges: Sent (blue), Responded (green), Not sent yet (grey), Closed (grey)

2. **Title Sizing:**
   - Changed request subject from text-lg to text-base
   - Maintains font-bold weight for hierarchy

3. **Data Updates:**
   - Updated mock data to use new status values
   - Removed overdue auto-detection logic from helper function
   - Simplified status badge function

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:168) - Status type definition
- [lib/task-utils.tsx](lib/task-utils.tsx:38-53) - Badge helper function
- [lib/mock-data/applicant-requests.ts](lib/mock-data/applicant-requests.ts:8-73) - Mock data status values
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:63) - Title text size

---

## New Request Form - Subpage Creation

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Create Request Workflow

Implemented subpage for creating new applicant requests with form validation and navigation.

**Changes Made:**

1. **New Request Form Component:**
   - Created `CreateRequestContent` component with form state management
   - Form fields: Subject (required), Message (required, 8 rows)
   - Field validation with required indicators (red asterisk)
   - Helper text for message field
   - Form submission handler (TODO: integrate with backend)
   - Cancel button returns to requests list

2. **New Request Page Route:**
   - Route: `/application/[id]/assessment/requests/new`
   - Uses `AssessmentLayout` wrapper for consistency with assessment workflow
   - Integrates with existing task panel and breadcrumbs
   - Server-side application data loading with notFound() handling

3. **Navigation Integration:**
   - "New request" button now links to new request page
   - Uses Next.js Link component for client-side navigation
   - Cancel button navigates back to requests list (task=999)
   - Submit handler redirects to requests list after submission

4. **Form Design:**
   - Title: "New request" (text-2xl font-bold)
   - Description explaining purpose and applicant notification
   - All content constrained to max-w-readable (723px)
   - 24px spacing between sections (space-y-6)
   - Action buttons: Primary "Send request" + Secondary "Cancel"
   - 3-column button layout with gap-3

5. **User Experience:**
   - Clear field labels with required indicators
   - Placeholder text for guidance
   - Helper text for message field
   - Textarea with 8 rows for detailed messages
   - Form prevents submission until required fields completed

**Visual Result:**
- Clean, focused form layout within assessment context
- Consistent spacing and typography with rest of application
- Clear call-to-action with primary/secondary button hierarchy
- Helper text provides guidance without cluttering interface
- Navigation flow: List → New → Submit → List

**Files Created:**
- [components/shared/create-request-content.tsx](components/shared/create-request-content.tsx) - NEW: Form component
- [app/application/[id]/assessment/requests/new/page.tsx](app/application/[id]/assessment/requests/new/page.tsx) - NEW: Page route

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:3,37-40) - Added Link import and navigation

**Spacing Fix:**
- Added `py-8` wrapper to page for consistent vertical spacing with other assessment pages
- Updated [app/application/[id]/assessment/requests/new/page.tsx](app/application/[id]/assessment/requests/new/page.tsx:26-28)

---

## Request Card Restructure - Information Architecture

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Card Content Reorganization

Restructured request cards to show clearer information hierarchy with labeled sections.

**Changes Made:**

1. **Card Structure (top to bottom):**
   - **Title** - Request subject (text-base font-bold)
   - **Status badge** - Positioned top-right aligned with title
   - **Reason** - Labeled section with request description
   - **Last updated** - Formatted date (response date if available, otherwise sent date)
   - **Latest update** - Response message and attachments (only shown if response exists)

2. **Section Labels:**
   - Added "Reason" label above description
   - Added "Last updated:" inline label with date
   - Added "Latest update" label above response message
   - All labels use font-medium for emphasis

3. **Last Updated Logic:**
   - If response exists: uses response.receivedDate
   - If no response: uses sentDate
   - Always formatted as "25 Mar 2024" (UK format)

4. **Latest Update Section:**
   - Only displays when response exists
   - Shows full response message
   - Lists attachment count and filenames
   - Format: "2 attachments: Drainage_Calculations_Rev_B.pdf, Attenuation_Tank_Specs.pdf"

5. **Removed Elements:**
   - Sent by metadata
   - Sent date metadata
   - Due date metadata
   - Request type metadata
   - "Response received" header with "New" badge

**Visual Result:**
- Clearer information hierarchy with labeled sections
- Easier to scan for key information
- Response content integrated naturally into card flow
- Last updated date provides temporal context at a glance
- Full response message visible without clicking through

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:60-110) - Complete card restructure

**Simplified Card Content:**
- Removed "Latest update" section with response message
- Removed attachment display
- Card now shows only: Title, Status, Reason, Last updated date
- Cleaner, more focused presentation
- Updated [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:88-95)

**Card Enhancement - Truncation and View Link:**
**Date:** 2025-11-06
**Agent:** Forge (Builder)

Added description truncation and view/update link to request cards:
- **Description truncation:** Truncates reason text at 150 characters with "..." if longer
- **View and update link:** Added at bottom of card with border-top separator
- **Link styling:** Primary color with hover underline
- Provides cleaner card view while allowing access to full details
- Updated [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:60-111)

---

## Applicant Requests - Cancel Request Feature

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Cancel Request Implementation

Added ability to cancel applicant requests with new 'cancelled' status.

**Changes Made:**

1. **Schema Update:**
   - Added 'cancelled' to `ApplicantRequestStatus` type
   - Updated [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:168)

2. **Status Badge:**
   - Added red 'Cancelled' badge variant to `getRequestStatusBadge()` helper
   - Updated [lib/task-utils.tsx](lib/task-utils.tsx:48-49)

3. **Mock Data:**
   - Added sample cancelled request (req-006: "Additional parking space dimensions")
   - Demonstrates cancelled status in card list
   - Updated [lib/mock-data/applicant-requests.ts](lib/mock-data/applicant-requests.ts:73-83)

---

## Applicant Requests - Card Layout Refinement (GDS Style)

**Date:** 2025-11-06
**Agent:** Forge (Builder)

### Simplified Card Layout with GDS Content Guidelines

Refined request cards to follow GDS content patterns with cleaner information hierarchy.

**Changes Made:**

1. **Card Structure (simplified):**
   - **Title** - Request subject (text-base font-bold)
   - **Status badge** - Positioned top-right aligned with title
   - **Metadata** - Date and requester in GDS format: "15 March 2024 by Federico Carbo"
   - **Description** - Request description (truncated at 150 characters)
   - **View link** - "View and update" link with border-top separator

2. **Removed Elements:**
   - Removed "Reason" label (description now stands alone)
   - Removed "Last updated" date (simplified to sent date only)
   - Removed inline cancel button (cancel functionality moved to individual request pages)
   - Removed React state management (no longer needed without inline cancel)

3. **Full Width Layout:**
   - Cards now span full width (removed max-w-readable constraint)
   - Action button container full width
   - Only title/description section remains constrained to max-w-readable

4. **GDS Metadata Format:**
   - Date formatted as "15 March 2024" (day, full month name, year)
   - Format: "{date} by {officer name}"
   - Muted foreground color for secondary information
   - Small text size (text-sm)

**User Experience:**
- Cleaner, more scannable card layout
- Date and requester information immediately visible
- GDS-compliant content presentation
- Cancel functionality available on individual request detail pages
- Consistent with government service patterns

**Visual Result:**
- Simplified information architecture
- Better vertical rhythm with reduced sections
- Full-width cards for better content flow
- Metadata follows GDS content guidelines
- Focus on essential information only

**Files Modified:**
- [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:1-106) - Complete card restructure

---

## Meetings Feature - Recording and Tracking Meetings

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Meetings Page Implementation

Implemented complete meetings feature for recording upcoming meetings and viewing meeting history related to planning applications.

**Changes Made:**

1. **Meeting Schema:**
   - Created `Meeting` interface in [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:187-193)
   - Fields: id, meetingDate (ISO string), notes (optional), recordedBy, recordedDate
   - Added `meetings` array to `PlanningApplication` interface

2. **Mock Data:**
   - Created [lib/mock-data/meetings.ts](lib/mock-data/meetings.ts) with sample meeting data
   - Four sample meetings: two upcoming, two past
   - Includes meetings with and without notes
   - Mock data imported into [lib/mock-data/applications.ts](lib/mock-data/applications.ts:9,415)

3. **Meetings Component:**
   - Created [components/shared/meetings-content.tsx](components/shared/meetings-content.tsx)
   - Card-based layout with upcoming/past sections
   - Automatic date-based separation (compares against current date)
   - Upcoming meetings sorted ascending (earliest first)
   - Past meetings sorted descending (most recent first)
   - Empty state handling when no meetings recorded

4. **Meeting Cards:**
   - Display format: "{date} at {time}" as title
   - GDS-style date formatting: "15 November 2025"
   - 24-hour time format: "10:00"
   - Metadata: "Recorded {date} by {officer name}"
   - Notes displayed below metadata when present
   - Consistent card styling with applicant requests (rounded-none, border-border)

5. **New Meeting Form:**
   - Inline form within MeetingsContent component (toggled with state)
   - Form fields: Meeting date (required), Meeting time (required), Notes (optional, 8 rows)
   - Native date/time inputs with proper labels and required indicators
   - Action buttons: "Add meeting" (primary) + "Cancel" (secondary)
   - Form submission handler ready for backend integration

6. **Assessment Integration:**
   - Added meetings routing to [components/shared/assessment-content.tsx](components/shared/assessment-content.tsx:12,43-50)
   - Task ID 996 routes to MeetingsContent component
   - Added meetings routing to [components/shared/future-assessment-content.tsx](components/shared/future-assessment-content.tsx:13,44-51)
   - Both current and future assessment versions support meetings

7. **Task Panel Count:**
   - Updated [components/shared/task-panel.tsx](components/shared/task-panel.tsx:31,243,246,295,311-312) to accept `upcomingMeetingsCount`
   - Dynamic count display in task panel: "Meetings (2)"
   - Count only shows upcoming meetings (not past meetings)
   - Removed hardcoded placeholder count

8. **Assessment Layout Integration:**
   - Updated [components/shared/assessment-layout.tsx](components/shared/assessment-layout.tsx:12,21,31,67-69,94) to pass meetings
   - Calculates upcoming meetings count: filters by date >= now
   - Passes count to TaskPanel component
   - Updated [app/application/[id]/assessment/page.tsx](app/application/[id]/assessment/page.tsx:35) to pass meetings from application

**User Experience:**

- Officers click "Meetings (2)" in task panel to access meetings page
- See clear separation between upcoming and past meetings
- Add new meeting with date, time, and optional notes
- Meetings automatically move from upcoming to past as time progresses
- GDS-compliant date/time formatting for consistency
- Clean, scannable card layout matching applicant requests pattern

**Data Flow:**

1. User clicks "Add meeting" button
2. Form appears inline (replaces list view)
3. User enters date, time, and optional notes
4. On submit: creates new Meeting record with recordedBy and recordedDate
5. Form closes, list refreshes with new meeting in appropriate section
6. Task panel count updates automatically based on upcoming meetings

**Visual Result:**

- Consistent card-based layout with rest of assessment workflow
- Clear temporal organization (upcoming vs past)
- Optional notes provide context flexibility
- Automatic date-based filtering requires no manual categorization
- Count badge in task panel shows actionable upcoming meetings only

**Files Created:**
- [lib/mock-data/meetings.ts](lib/mock-data/meetings.ts) - NEW: Mock meeting data
- [components/shared/meetings-content.tsx](components/shared/meetings-content.tsx) - NEW: Meetings component

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:187-193,219) - Meeting schema and PlanningApplication update
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts:9,415) - Import and add meetings data
- [components/shared/assessment-content.tsx](components/shared/assessment-content.tsx:12,43-50) - Meetings routing
- [components/shared/future-assessment-content.tsx](components/shared/future-assessment-content.tsx:13,44-51) - Meetings routing
- [components/shared/task-panel.tsx](components/shared/task-panel.tsx:31,243,246,295,311-312) - Upcoming meetings count
- [components/shared/assessment-layout.tsx](components/shared/assessment-layout.tsx:12,21,31,67-69,94) - Pass meetings and calculate count
- [app/application/[id]/assessment/page.tsx](app/application/[id]/assessment/page.tsx:35) - Pass meetings prop

---

## Meetings Feature Enhancement - Timeline Layout and Edit Functionality

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Timeline View and Meeting Editing

Enhanced meetings feature with timeline layout grouped by date, meeting titles, and full edit capability.

**Changes Made:**

1. **Meeting Schema Update:**
   - Added `title` field to `Meeting` interface in [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:189)
   - Title is required field for all meetings
   - Updated interface: `{ id, title, meetingDate, notes?, recordedBy, recordedDate }`

2. **Mock Data Enhancement:**
   - Updated [lib/mock-data/meetings.ts](lib/mock-data/meetings.ts) with meeting titles
   - Sample titles: "Pre-application meeting with applicant", "Site visit with conservation officer", etc.
   - Notes remain optional for flexibility

3. **Timeline Layout:**
   - Replaced upcoming/past sections with date-grouped timeline view
   - Meetings grouped by full date: "15 November 2025"
   - Date headers (h2, font-bold) separate each day's meetings
   - Sorted descending (most recent date first)
   - Multiple meetings on same date appear under single date header
   - `groupMeetingsByDate()` helper function handles grouping logic

4. **Meeting Cards Redesign:**
   - Title as primary heading (text-base, font-bold)
   - Time displayed below title (text-sm, muted)
   - Date removed from card (now in timeline header)
   - "Recorded by" metadata unchanged
   - Notes displayed when present
   - "Edit meeting" link added at bottom with border-top separator
   - Hover effect on card border for interactivity

5. **Edit Meeting Functionality:**
   - New `FormMode` type: 'list' | 'add' | 'edit'
   - `editingMeeting` state tracks which meeting is being edited
   - `handleEdit()` function sets mode and meeting
   - Form pre-populates with existing meeting data
   - Edit form title: "Edit meeting"
   - Submit button text: "Save changes"
   - Date/time parsing handles ISO string to input format conversion

6. **Form Enhancement:**
   - Added "Meeting title" field (required) at top of form
   - Placeholder text: "e.g. Pre-application meeting with applicant"
   - Form fields order: Title → Date → Time → Notes
   - Form mode determines title and submit button text
   - Cancel button clears editing state and returns to list

7. **Component Architecture:**
   - `MeetingsContent` - Main container with mode state
   - `MeetingCard` - Card component with edit callback
   - `MeetingForm` - Unified form for add/edit modes
   - `groupMeetingsByDate()` - Timeline grouping helper
   - State management handles form mode transitions

**User Experience:**

- Officers see meetings organized chronologically by date
- Timeline structure provides clear temporal narrative
- Meeting titles give quick context without reading notes
- Click "Edit meeting" to modify any meeting details
- Form pre-fills with current data when editing
- All fields editable: title, date, time, notes
- Clear distinction between add and edit modes

**Visual Result:**

- Clean timeline layout with date headers
- Meeting title prominently displayed
- Time shown below title (not in heading)
- Cards grouped by date reduce redundancy
- Edit link provides clear action affordance
- Consistent with applicant requests card pattern

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts:189) - Added title field to Meeting interface
- [lib/mock-data/meetings.ts](lib/mock-data/meetings.ts:5-35) - Added titles to all mock meetings
- [components/shared/meetings-content.tsx](components/shared/meetings-content.tsx:1-311) - Complete redesign with timeline and edit

---

## Meetings Timeline - DWP Design System Visual Structure

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### DWP Timeline Pattern Implementation

Updated meetings timeline with DWP Design System visual structure featuring vertical timeline with dots and connecting lines.

**Changes Made:**

1. **Timeline Visual Structure:**
   - Vertical timeline line (4px width, border color) runs down left side
   - Blue circular dots (16px diameter) mark each date
   - Timeline dot positioned at 32px from left edge
   - Connecting lines between date dots
   - Content indented 48px (ml-12) from left edge

2. **Date Header Integration:**
   - Date appears inline with timeline dot
   - Dot and date aligned horizontally with 16px gap
   - Date text uses text-base font-bold
   - Dot positioned with 4px top margin for alignment

3. **Timeline Line Logic:**
   - Line connects previous date to current date dot
   - Line continues from dot down to meetings section
   - Last date section: line stops after meetings (no continuation)
   - Lines positioned at 14px from left (centered on 16px dot)

4. **Meeting Cards Layout:**
   - Cards indented 48px from left (ml-12 = 3rem = 48px)
   - Creates clear visual hierarchy: dot → date → meetings
   - 16px spacing between meeting cards (space-y-4)
   - 32px spacing between date sections (pb-8)

5. **Responsive Considerations:**
   - Fixed width timeline column (32px) ensures consistent alignment
   - Flexible content area adapts to available space
   - Timeline structure maintains on all screen sizes
   - Dot size (16px) and line width (4px) remain constant

**Visual Hierarchy:**

```
● 15 November 2025
│     [Meeting Card 1]
│     [Meeting Card 2]
│
● 10 November 2025
│     [Meeting Card 3]
│
● 5 November 2025
      [Meeting Card 4]
```

**Timeline Measurements:**
- Timeline dot: 16px × 16px circle
- Timeline line: 4px width
- Left margin: 32px (timeline column)
- Content indent: 48px (from left edge)
- Gap between dot and date: 16px
- Spacing between cards: 16px
- Spacing between date groups: 32px

**User Experience:**

- Clear chronological narrative with visual timeline
- Dots provide visual anchors for scanning
- Connecting lines show temporal continuity
- Date headers prominently displayed
- Meeting cards clearly grouped by date
- Professional DWP/GDS aesthetic

**Files Modified:**
- [components/shared/meetings-content.tsx](components/shared/meetings-content.tsx:62-133,162-168) - DWP timeline visual structure

---

## Meetings Timeline - Refined DWP Pattern

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Simplified Timeline Implementation

Refined meetings timeline to match DWP Design System pattern more precisely with continuous vertical line and horizontal markers.

**Changes Made:**

1. **Simplified Timeline Structure:**
   - Continuous 4px blue vertical line on left side (border-l-4)
   - Horizontal line markers (32px × 4px) extend from vertical line at each date
   - No separate dots - markers provide visual anchors
   - Cleaner, more minimal appearance

2. **Timeline Implementation:**
   - Container has `border-l-4 border-primary` for continuous vertical line
   - Left padding of 32px (pl-8) for content spacing
   - Horizontal markers positioned at `-32px` from left edge
   - Markers appear at top of each date header (8px from top)

3. **Spacing Updates:**
   - 32px spacing between date sections (pb-8)
   - 24px spacing between meeting cards (space-y-6)
   - Consistent with DWP reference implementation
   - Last date section removes bottom padding

4. **Visual Hierarchy:**
   - Vertical line provides continuous timeline spine
   - Horizontal markers indicate event points
   - Date headers bold and prominent
   - Meeting cards indented from timeline

**DWP Pattern Match:**
```
|—— Date Header
|    [Meeting Card]
|    [Meeting Card]
|
|—— Date Header
|    [Meeting Card]
|
|—— Date Header
     [Meeting Card]
```

**Technical Details:**
- Vertical line: 4px width, primary color
- Horizontal markers: 32px width × 4px height
- Content indent: 32px from vertical line
- Marker position: -32px left, 8px top

**User Experience:**
- Clear continuous timeline shows progression
- Horizontal markers provide visual scan points
- Simpler design reduces visual noise
- Professional DWP/GDS aesthetic maintained

**Files Modified:**
- [components/shared/meetings-content.tsx](components/shared/meetings-content.tsx:67-100) - Simplified DWP timeline pattern

---

## Applicant Portal - User Switcher and Basic Layout

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Dual User Experience Implementation

Added applicant portal with user switching capability in site header and basic navigation structure.

**Changes Made:**

1. **User Switcher in Site Header:**
   - Added `userType` prop to SiteHeader component ('officer' | 'applicant')
   - Link-based switcher in header navigation
   - Officer view: "Switch to Applicant" link → `/applicant`
   - Applicant view: "Switch to Officer" link → `/`
   - Maintains clean URL-based navigation pattern
   - Updated [components/shared/site-header.tsx](components/shared/site-header.tsx:2,6,9,19-28)

2. **Service Navigation Component:**
   - Created new navigation component for applicant pages
   - Tab-based navigation: Tasks, Timeline
   - Active state indication with bottom border (5px, primary color)
   - Client component using usePathname for active state detection
   - Constrained to 1100px max-width matching site design
   - Hover states for inactive tabs
   - Created [components/shared/service-navigation.tsx](components/shared/service-navigation.tsx) - NEW

3. **Applicant Layout Structure:**
   - New `/applicant` route with dedicated layout
   - SiteHeader with `userType="applicant"`
   - ServiceNavigation below header
   - Consistent 1100px max-width container
   - Created [app/applicant/layout.tsx](app/applicant/layout.tsx) - NEW
   - Created [app/applicant/page.tsx](app/applicant/page.tsx) - NEW (redirects to tasks)

4. **Applicant Pages:**
   - **Tasks page**: Title only for now ([app/applicant/tasks/page.tsx](app/applicant/tasks/page.tsx) - NEW)
   - **Timeline page**: Title only for now ([app/applicant/timeline/page.tsx](app/applicant/timeline/page.tsx) - NEW)
   - Both pages use constrained layout (max-w-[1100px])
   - 32px vertical padding (py-8)
   - Title styling: text-2xl font-bold

**User Experience:**

- Officers can switch to applicant view from any page
- Applicants can switch back to officer view
- Clear navigation structure with Tasks and Timeline tabs
- Active tab highlighted with primary color border
- Simple, focused interface for applicants
- Ready for content implementation in future iterations

**Navigation Flow:**
```
Officer View (/)
  ↓ "Switch to Applicant"
Applicant View (/applicant/tasks)
  - Tasks tab (active)
  - Timeline tab
  ↓ "Switch to Officer"
Officer View (/)
```

**Architecture:**
- Separate layout for applicant routes
- Service navigation scoped to applicant section
- URL-driven navigation state (no additional state management)
- Extensible for adding more service tabs in future

**Files Created:**
- [components/shared/service-navigation.tsx](components/shared/service-navigation.tsx) - NEW: Service navigation component
- [app/applicant/layout.tsx](app/applicant/layout.tsx) - NEW: Applicant layout wrapper
- [app/applicant/page.tsx](app/applicant/page.tsx) - NEW: Applicant root (redirects to tasks)
- [app/applicant/tasks/page.tsx](app/applicant/tasks/page.tsx) - NEW: Tasks page (placeholder)
- [app/applicant/timeline/page.tsx](app/applicant/timeline/page.tsx) - NEW: Timeline page (placeholder)

**Files Modified:**
- [components/shared/site-header.tsx](components/shared/site-header.tsx:2,6,9,19-28) - Added user switcher

---

## Applicant Portal - Requests and Timeline Implementation

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Complete Applicant Experience with Requests and Timeline

Implemented full applicant portal with requests page and comprehensive timeline showing all application events.

**Changes Made:**

1. **Service Navigation Update:**
   - Renamed "Tasks" → "Requests" for clarity
   - Added `applicationId` prop support for dynamic routing
   - Routes: `/applicant/[id]/requests` and `/applicant/[id]/timeline`
   - Updated [components/shared/service-navigation.tsx](components/shared/service-navigation.tsx:20)

2. **Applicant Requests Page:**
   - Read-only view of all requests sent by officers
   - Card-based layout matching officer view pattern
   - Shows: subject, description (truncated at 150 chars), sent date, status, officer name
   - Response section shows applicant's reply and attachments when present
   - Status badges: Sent (blue), Responded (green), Closed (grey), Cancelled (red)
   - Created [components/shared/applicant-requests-view.tsx](components/shared/applicant-requests-view.tsx) - NEW
   - Created [app/applicant/[id]/requests/page.tsx](app/applicant/[id]/requests/page.tsx) - NEW

3. **Timeline Event System:**
   - Created comprehensive event aggregation system
   - Unified `TimelineEvent` interface for all event types
   - Event categories: meetings-visits, documents, milestones
   - Event types: meeting, site-visit, telephone-call, document-upload, milestone
   - Helper functions for filtering, sorting, grouping by date
   - Created [lib/timeline-utils.ts](lib/timeline-utils.ts) - NEW

4. **Applicant Timeline Page:**
   - **Upcoming Section**: Future meetings and site visits in card layout
   - **Activity History Section**: Past events with DWP timeline pattern
   - **Filtering**: [All] [Meetings & visits] [Documents] [Milestones]
   - Timeline with vertical blue bar, date grouping, horizontal markers
   - Event cards with type badges, descriptions, metadata
   - Sorted: upcoming ascending (soonest first), past descending (most recent first)
   - Created [components/shared/applicant-timeline-view.tsx](components/shared/applicant-timeline-view.tsx) - NEW
   - Created [app/applicant/[id]/timeline/page.tsx](app/applicant/[id]/timeline/page.tsx) - NEW

5. **Timeline Events Included:**
   - **Meetings & Visits**: All Meeting records (meeting, site-visit, telephone-call)
   - **Documents**: Document uploads by applicant
   - **Milestones**: Application submitted, validated, consultation started/ended, stage completions, decision made
   - Each event shows: title, date/time, description, type badge, attachments count

6. **Route Structure:**
   - `/applicant` → Redirects to first application's requests page
   - `/applicant/[id]/layout.tsx` → Nested layout with ServiceNavigation
   - `/applicant/[id]/requests` → Applicant requests view
   - `/applicant/[id]/timeline` → Timeline with upcoming and history
   - Removed: `/applicant/tasks` and `/applicant/timeline` (old placeholder routes)

7. **Event Type Badges:**
   - Meeting (blue), Site visit (turquoise), Phone call (purple)
   - Document (green), Milestone (light-blue)
   - Consistent badge variants across application

**User Experience:**

**Requests Page:**
- Applicants see all officer requests and their responses
- Clear status indication (sent, responded, closed, cancelled)
- Truncated descriptions with full text preserved in data
- Response messages and attachment counts visible
- Read-only view - no actions to create or respond (officer-initiated only)

**Timeline Page:**
- Clear separation: "Upcoming" vs "Activity history"
- Upcoming events show future meetings/visits in simple cards
- Activity history shows chronological timeline with filtering
- Filter buttons highlight active state with primary color
- DWP timeline pattern: vertical bar, date headers, horizontal markers
- Event cards with hover states and type badges
- Empty states handle no upcoming events or no activity

**Navigation Flow:**
```
/applicant
  ↓
/applicant/APP-001/requests (default)
  - View all requests from officers
  - See responses submitted

/applicant/APP-001/timeline
  - See upcoming meetings/visits
  - Filter activity history
  - Track application progress
```

**Data Flow:**

1. **Timeline Event Aggregation**:
   - `getTimelineEvents()` extracts all events from PlanningApplication
   - Meetings, documents, milestones combined into unified structure
   - Each event has: type, category, date, title, description, metadata

2. **Event Filtering**:
   - `separateUpcomingAndPast()` splits events by date vs now
   - `filterEventsByCategory()` applies user-selected filter
   - `groupEventsByDate()` groups for timeline display

3. **Event Display**:
   - Upcoming: simple cards, no timeline visual, ascending sort
   - Past: DWP timeline pattern, grouped by date, descending sort
   - Type badges from `getEventTypeBadge()` helper

**Architecture:**

- Nested layouts: `/applicant/layout.tsx` → `/applicant/[id]/layout.tsx`
- Service navigation scoped to application-specific routes
- Timeline utilities separate from components for reusability
- Event system extensible for adding new event types
- Consistent card styling across requests and timeline

**Files Created:**
- [lib/timeline-utils.ts](lib/timeline-utils.ts) - NEW: Event aggregation and filtering utilities
- [components/shared/applicant-requests-view.tsx](components/shared/applicant-requests-view.tsx) - NEW: Requests component
- [components/shared/applicant-timeline-view.tsx](components/shared/applicant-timeline-view.tsx) - NEW: Timeline component
- [app/applicant/[id]/layout.tsx](app/applicant/[id]/layout.tsx) - NEW: Application-specific layout
- [app/applicant/[id]/requests/page.tsx](app/applicant/[id]/requests/page.tsx) - NEW: Requests page route
- [app/applicant/[id]/timeline/page.tsx](app/applicant/[id]/timeline/page.tsx) - NEW: Timeline page route

**Files Modified:**
- [components/shared/service-navigation.tsx](components/shared/service-navigation.tsx:20) - Renamed Tasks → Requests
- [app/applicant/layout.tsx](app/applicant/layout.tsx:1-14) - Removed ServiceNavigation (moved to nested layout)
- [app/applicant/page.tsx](app/applicant/page.tsx:1-22) - Redirect to first application's requests

**Files Deleted:**
- `/app/applicant/tasks/` - Removed old tasks placeholder
- `/app/applicant/timeline/` - Removed old timeline placeholder

---

## Applicant Timeline - UX Improvements

**Date:** 2025-11-10
**Agent:** Forge (Builder)

### Applicant-Centric Experience Enhancements

Improved the applicant timeline based on UX analysis to make it more user-friendly, contextual, and action-oriented.

**Changes Made:**

1. **Removed Filter System:**
   - **Problem:** Two-step filtering (checkboxes + Apply button) added unnecessary friction for only 2 categories
   - **Solution:** Removed filters entirely - show all events by default
   - **Impact:** Simpler interface, no cognitive load from temporary filter states
   - **Files:** Removed Checkbox import, filter state management, and filter UI

2. **Always Show Upcoming Section:**
   - **Problem:** Section disappeared when no upcoming events, leaving users confused
   - **Solution:** Always display "Upcoming" section with helpful empty state
   - **Empty state:** "No upcoming meetings or site visits scheduled."
   - **Impact:** Users always know what to expect, consistent layout
   - **Files:** Updated conditional rendering logic

3. **Application Context Banner:**
   - **Problem:** No context about which application or where it is in the process
   - **Solution:** Added context banner at top showing:
     - Application ID and address
     - Current status (formatted from snake-case)
     - Submitted date (e.g., "Submitted: 15 Mar 2024")
     - Decision deadline (e.g., "Decision by: 10 May 2024")
   - **Design:** Muted background, border, responsive flex layout
   - **Impact:** Users immediately understand context and timeline
   - **Files:** Added banner in [applicant-timeline-view.tsx](components/shared/applicant-timeline-view.tsx:43-57)

4. **Plain Language Milestone Descriptions:**
   - **Problem:** Technical jargon not suitable for applicants (e.g., "Your application has been checked and validated")
   - **Solution:** Rewrote all milestone descriptions in applicant-friendly language

   **Examples:**
   - **Before:** "Application validated" → "Your application has been checked and validated"
   - **After:** "Application accepted" → "Your application is complete and has been accepted for processing. The planning team will now review your proposal."

   - **Before:** "Assessment completed" → "Planning officers have completed the assessment"
   - **After:** "Assessment complete" → "Our planning team has finished assessing your application against planning policies. Your application is now being reviewed by senior officers."

   - **Before:** "Application approved" → "Your application has been approved"
   - **After:** "Application approved" → "Your planning application has been approved. You will receive formal notification with any conditions attached to the permission."

   - **Impact:** Clear communication, reduced anxiety, explains what happens next
   - **Files:** Updated all milestone descriptions in [timeline-utils.ts](lib/timeline-utils.ts:72-159)

5. **Clickable Attachments:**
   - **Problem:** Attachment counts shown but not actionable
   - **Solution:** Display individual attachment filenames as clickable links
   - **Design:** Border-top separator, list of links with hover underline
   - **Format:** "{count} documents: [filename1] [filename2]"
   - **Implementation:** Placeholder click handler ready for backend integration
   - **Impact:** Users can access meeting documents directly from timeline
   - **Files:** Updated both UpcomingEventCard and TimelineEventCard components

6. **Add to Calendar:**
   - **Problem:** No way to add upcoming meetings/visits to personal calendar
   - **Solution:** Added "Add to calendar" button for all upcoming events
   - **Implementation:** Generates ICS file (standard calendar format) that downloads when clicked
   - **Details:** Creates 1-hour event with title, description, date/time
   - **Compatibility:** Works with Google Calendar, Outlook, Apple Calendar, and other standard calendar apps
   - **Impact:** Users can easily track meetings in their own calendar system
   - **Files:** Added calendar generation function to UpcomingEventCard component

**UX Improvements Summary:**

| Issue | Priority | Solution | Impact |
|-------|----------|----------|--------|
| Complex filtering | Moderate | Removed | Simpler interface |
| Hidden upcoming section | High | Always show with empty state | Consistent experience |
| Missing context | High | Application banner | Clear orientation |
| Technical language | Moderate | Plain language milestones | Better comprehension |
| Non-actionable attachments | Low | Clickable links | Direct access |
| No calendar integration | Low | Add to calendar button | Personal calendar sync |

**Language Tone Changes:**

**Before (Technical):**
- "Application validated"
- "Planning officers have completed..."
- "Senior review has been completed"

**After (Applicant-Friendly):**
- "Application accepted"
- "Our planning team has finished..."
- "Senior officers have completed their review. A decision on your application will be made soon."

**Context Banner Format:**
```
┌─────────────────────────────────────────────────────────────┐
│ Application APP-001: 123 High Street, London SE1 1AA       │
│ Status: Under review • Submitted: 15 Mar 2024 •            │
│ Decision by: 10 May 2024                                   │
└─────────────────────────────────────────────────────────────┘
```

**User Benefits:**

1. **Reduced Cognitive Load:** No filter management, everything visible by default
2. **Better Context:** Always know which application and where it stands
3. **Clear Communication:** Plain language explains process and next steps
4. **Actionable Information:** Can download documents directly from timeline
5. **Consistent Experience:** Sections always present, no surprise disappearances

**Accessibility:**
- Maintained semantic HTML structure
- Proper label associations for all interactive elements
- Clear focus states on links
- Descriptive link text for screen readers

**Files Modified:**
- [components/shared/applicant-timeline-view.tsx](components/shared/applicant-timeline-view.tsx) - Removed filters, added banner, always show upcoming, clickable attachments
- [lib/timeline-utils.ts](lib/timeline-utils.ts:72-159) - Rewrote milestone descriptions in plain language

---
