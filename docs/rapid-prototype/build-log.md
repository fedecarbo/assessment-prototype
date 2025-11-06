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
- Updated in [components/shared/applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx:28,40,43,65,67,91,106,109,112)

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
- [applicant-requests-content.tsx](components/shared/applicant-requests-content.tsx)
- [create-request-content.tsx](components/shared/create-request-content.tsx)
- [request-detail-content.tsx](components/shared/request-detail-content.tsx)

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
