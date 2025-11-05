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
