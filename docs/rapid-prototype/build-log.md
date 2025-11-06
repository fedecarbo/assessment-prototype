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

---
