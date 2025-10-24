# Build Log

Quick reference for what's been built and key architectural decisions.

---

## Project Foundation (2025-10-17)

**Tech Stack:** Next.js 15 + TypeScript (strict) + Tailwind v4 + Shadcn UI
**Design System:** GDS color palette, Airbnb-inspired flat layouts, 5px spacing base
**Mock Data:** Type-safe schemas for planning applications, stage workflows, consultations

---

## Application Detail Page

**Route:** `/application/[id]`
**Layout Pattern:** Product detail with collapsing hero, sticky scrollspy navigation

### Core Components

**ApplicationDetailLayout** - Main layout wrapper
- Collapsing hero (map placeholder: 550px square)
- Sticky condensed header + navigation (appears after 80px scroll)
- IntersectionObserver-based scrollspy
- 7 sections: Overview, Timeline, Documents, Constraints, Site history, Consultees, Neighbours

**ApplicationSections** - Section router with placeholder heights

### Section Components

**Overview** (66/33 two-column layout)
- **ProposalDescription** - Expandable descriptions (>200 chars), show more/less toggle
- **ApplicationMetadata** - 3-column grid: officer assignment, public portal, app type
- **ApplicationStageTimeline** - Stage workflow with tasks, dependencies, contextual dates, status badges
  - Stages: Validation → Consultation + Assessment (parallel) → Review
  - Contextual actions: Blue buttons (active), text links (completed), locked (grey)
  - Status badges: Black (completed), blue (in progress), grey (locked)

**Documents**
- **DocumentList** - Collapsible categories (Drawings, Supporting, Evidence)
  - Filename-first links, tag badges, 64px thumbnails
  - Default: Drawings expanded, others collapsed

**Constraints**
- **ConstraintsSummary** - 33/66 split: map placeholder + grouped constraint list
  - Only shows identified constraints (no "does not apply")
  - Icons per type: Building2, Landmark, TreeDeciduous, Droplets, etc.

**Consultees**
- **ConsulteeSummary** - Statutory consultee responses
  - Positions: no-objection, objection, amendments-needed, not-contacted, awaiting-response
  - Side-by-side: consultee list + AI summary
  - Statistics line with response rate

**Neighbours**
- **NeighbourConsultation** - Resident responses with topic analysis
  - Positions: support, object, neutral (color-coded in stats)
  - Side-by-side: topic frequency list + AI summary
  - Topics: design, privacy, loss-of-light, traffic, accessibility, noise, other

### Shared Components

**ApplicationStatusBadges** - Reusable status + countdown badges (hero + condensed header)
**ConsultationStatistics** - Inline metrics with bullet separators (shared by consultees/neighbours)

### UI Components

**Badge** - CVA-based with variants: blue, yellow, green, red, gray, muted, black
- No border radius (sharp corners for GDS compliance)
- Two sizes: default (px-3 py-1 text-base), small (px-2 py-0.5 text-sm)
- Used consistently across all position badges and topic tags
**ThemeToggle** - Dark mode (next-themes) with sun/moon icons
**Table** - Shadcn table component for data display

### Shared Data Display Components

**DocumentsTable** - Table view for document listings
- **Columns:** Thumbnail, Document name, Category, Version, Visibility (5 columns total)
- **Column headers:** text-base, font-bold, text-foreground (black), empty header for thumbnail column
- **Thumbnail column:** 80px width
  - 64px × 64px light grey placeholder box (bg-muted), rounded corners
  - Will be replaced with actual document preview images in future
- **Document name cell:** Stacked layout with 10px margin-top between name and tags
  - Primary text link: text-base, font-medium, text-primary with hover underline
  - Tags displayed below name (small badge variant, muted, flex-wrap with 1.5 gap)
  - No tags shown if document has no tags (cleaner than placeholder)
- **Category:** Formatted labels (Drawings, Supporting, Evidence)
- **Version:** Optional version string (v1, v2, Rev A) or em dash if not present
- **Visibility:** Public or Sensitive label
- Reduces horizontal clutter by stacking tags under document names
- Used in ApplicationInfoDocuments tab

**ConstraintsTable** - Simplified table view for constraint listings with individual visibility toggles
- **Columns:** Show, Constraint, Details (3 columns total)
- **Column headers:** text-base, font-bold, text-foreground (black)
- **Show column:** Checkbox to toggle constraint visibility on map
  - Width: w-12 (48px)
  - Controls whether constraint appears on the map
  - State managed by parent component (visibleConstraints Set)
- **Constraint column:** Icon + label layout
  - Constraint type icons: Building2 (conservation-area), Landmark (listed-building), TreeDeciduous (tpo), Droplets (flood-risk), Trees (green-belt), FileText (article-4), Castle (archaeology)
  - Icon size: h-5 w-5, text-foreground color
  - Label: text-base, font-medium, 10px gap from icon
- **Details column:** Optional constraint details or em dash if not present
- **Props:** constraints[], visibleConstraints (Set<string>), onToggleConstraint callback
- Used in ApplicationInfoConstraints tab

---

## Design System

**Colors:**
- Primary: GDS blue `hsl(211 66% 41%)` (#1d70b8)
- Foreground: GDS black `hsl(0 0% 5%)` (#0b0c0c)
- Dark mode: Neutral grays (0% saturation), bg 5%, card 8%, border 20%

**Typography:**
- Base: 1.188rem / 1.563rem
- Section titles: text-xl font-bold
- Hero address: text-2xl

**Spacing:**
- Base unit: 5px (p-4 = 20px)
- Sections: pt-8 pb-8 pattern
- Dividers: Between sections (not inside) for symmetry

**Layout:**
- Content constraint: 1100px max-width
- Two-column split: 66% content / 33% sidebar
- Responsive: Single column mobile, side-by-side 1024px+

---

## Schema Architecture

**Stage Workflows:** ValidationStage, ConsultationStage, AssessmentStage, ReviewStage
**Stage Tasks:** id, title, completed, completedDate
**Documents:** id, name, category, tags[], fileSize, fileType, version?, visibility (public/sensitive)
**Constraints:** id, type, label, status, details?, value?
**Consultees:** ConsulteeResponse with position, responseDate, summary
**Neighbours:** NeighbourResponse with position, topics[]

---

## Assessment Page

**Route:** `/application/[id]/assessment`
**Layout Pattern:** Full-width layout with site header, breadcrumbs, and case summary
**Mobile Pattern:** Task list view with page navigation to individual tasks

### Core Components

**AssessmentLayout** - Full-width layout wrapper with two-column structure and independent scrolling (client component)
- **Fixed headers:** Site header, breadcrumbs, and case summary remain at top (flex-none)
- **Viewport height:** Uses `h-screen` with flexbox column layout
- **Responsive two-column layout:**
  - **Desktop (md+):** Side-by-side layout
    - Left: TaskPanel (370px total: 338px + 32px padding, `overflow-y-auto`)
    - Right: Main content area (`flex-1`, takes remaining space, centered, `overflow-y-auto`)
    - Both panels always visible
  - **Mobile (<md):** Stacked layout with conditional visibility
    - Shows TaskPanel OR Content based on `selectedTaskId` state
    - TaskPanel: Full-width, scrollable, shown when `selectedTaskId === 0`
    - Content: Full-width, scrollable, shown when `selectedTaskId > 0`
    - Layout changes from `flex-col` on mobile to `flex-row` on desktop
- **Content constraint:** 1100px max-width with 16px horizontal padding (px-4), centered within main area
- **Independent scrolling:** Each content area scrolls independently with its own scrollbar
- **Task selection state:** URL-driven via query params (`?task=X`), synced with context state
- **Render prop pattern:** Children function receives `selectedTaskId` to render task-specific content
- Headers stay fixed while content areas scroll

**SiteHeader** - Global navigation header
- Southwark branding with "Back-office Planning System"
- User name and logout link
- 10px blue border bottom (matches GDS primary color)
- Theme toggle integration
- **Variant support:** `constrained` (default, 1100px max-width) | `full` (no max-width)

**Breadcrumbs** - Navigation trail component
- Light blue background (GDS primary 95% lightness)
- Greater-than (>) separators between items
- All text in black (foreground color) with underline
- Underline styling: `decoration-1` default, `decoration-2` on hover with smooth transition
- Underline offset: `0.1578em` (using Tailwind arbitrary value syntax)
- **Variant support:** `constrained` (default, 1100px max-width) | `full` (no max-width)
- Application detail page: `constrained` variant with trail Home → Application details
- Assessment page: `full` variant with trail Home → Application details → Check and assess

**CaseSummaryHeader** - Condensed application header (client component)
- **Desktop layout:** Reference number + address in single line (left side), quick links on right side
- **Mobile layout:** Stacked vertically with responsive gap spacing
  - Reference and address stack on separate lines (removed vertical divider on mobile)
  - "Show/Hide proposal description" button below
  - "Application information" link at bottom
- Quick links: "Application information", "Documents" (right side on desktop)
- Optional "Show/Hide proposal description" toggle button
- Expandable description panel with smooth transition (300ms)
- Description constrained to max-w-4xl (896px) for readability
- Replaces the collapsing hero pattern from detail page

**TaskPanel** - To-do list style task sidebar with independent scroll
- **Desktop:** Fixed width (338px + 16px padding each side = 370px total)
- **Mobile:** Full-width (`w-full`)
- Independent scrolling: `overflow-y-auto`
- Border right separator
- **To-do list design pattern:**
  - Main heading: "Tasks" (text-xl font-bold, 24px bottom margin)
  - Group titles: text-sm font-semibold, uppercase, muted foreground, wide tracking, 12px bottom margin
  - Task items: Rounded cards with checkbox-left, text-right layout
  - Hover state: Muted background (hover:bg-muted/50)
  - Selected state: Full muted background (bg-muted)
- **Checkbox states** (left-aligned):
  - Completed: Filled black checkbox with white checkmark (border-2 border-foreground bg-foreground)
  - In progress: Hollow checkbox with small blue square inside (border-2 border-primary, 8px blue square)
  - Not started: Empty checkbox (border-2, dynamically colored: foreground when selected, muted-foreground otherwise)
  - Size: 20px × 20px (h-5 w-5), rounded-sm
- **Task text:**
  - Completed: Muted foreground with line-through
  - Selected: Foreground color, font-medium
  - Default: Foreground color
  - Size: text-sm with leading-tight
- **Spacing:**
  - Between task groups: 24px (space-y-6)
  - Between tasks within group: 8px (space-y-2)
  - Task padding: 8px (p-2)
  - Checkbox to text gap: 12px (gap-3)
- **Link behavior:** Uses Next.js Link with query params `?task={id}`, maintains onClick callback
- Scrolls independently from main content area
- Callbacks: `onTaskSelect(taskId)` updates parent state

**AssessmentContent** - Dynamic task content renderer (client component)
- **Mobile:** "Back to tasks" button with chevron icon at top (only visible on mobile)
  - Links to base URL (removes `?task=X` param)
  - Triggers `setSelectedTaskId(0)` to show task panel
- Text-based layout displaying task details:
  - **Status badge** at top (green/blue/gray)
  - **Task title** (text-xl font-bold)
  - **Task description/instruction** (mt-6, text-base leading-relaxed, max 2 lines)
  - **Separator divider** (mt-8, full width) below description
- Content width constrained to 723px for optimal readability
- Clean, readable layout with proper spacing
- Placeholder content sections (30 items for scroll demo)

**AssessmentContext** - React Context for task state management
- `TaskStatus` type: `'not-started' | 'in-progress' | 'completed'`
- `Task` interface: id, title, description, status
- `TaskGroup` interface: title, tasks array
- Mock data: 11 realistic planning assessment tasks organized in 4 groups
  - Check application: Check application details (completed), Check consultees consulted (completed), Check site history (in-progress)
  - Additional services: Site visit (not-started), Meeting (not-started)
  - Assessment summaries: Site description (not-started), Summary of advice (not-started), Planning considerations and advice (not-started)
  - Complete assessment: Choose application type (not-started), Check and add requirements (not-started), Review and submit pre-application (not-started)
- **URL synchronization:** Reads `?task=X` query param to initialize and sync `selectedTaskId`
  - Default: `selectedTaskId = 0` (no task selected, shows task panel on mobile)
  - With param: `selectedTaskId = parseInt(task)` (shows content on mobile)
  - Updates when URL changes via `useEffect` hook
- Provides `selectedTaskId`, `setSelectedTaskId`, `taskGroups` array, and `taskMap` for O(1) lookups
- `useAssessment()` hook for consuming context

### Layout Differences from Application Detail Page

| Feature | Application Detail | Assessment Page |
|---------|-------------------|-----------------|
| Width | 1100px max-width | Full width |
| Hero | Collapsing with map | Case summary (no map) |
| Navigation | Sticky scrollspy tabs | Breadcrumbs only |
| Header | Conditional condensed | Always visible summary |

---

## Key Files

**Layouts:**
- [application-detail-layout.tsx](components/shared/application-detail-layout.tsx) - Constrained width with collapsing hero
- [assessment-layout.tsx](components/shared/assessment-layout.tsx) - Full-width with case summary
- [application-sections.tsx](components/shared/application-sections.tsx)

**Headers:**
- [site-header.tsx](components/shared/site-header.tsx) - Global navigation
- [case-summary-header.tsx](components/shared/case-summary-header.tsx) - Application summary
- [breadcrumbs.tsx](components/shared/breadcrumbs.tsx) - Navigation trail

**Schemas:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
**Mock Data:** [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
**Utilities:** [lib/utils.ts](lib/utils.ts) - formatDate, calculateResponseRate
**Styles:** [app/globals.css](app/globals.css) - Tailwind v4 theme variables

---

## Home Page

**Route:** `/`
**Pattern:** Centered landing page with call-to-action

### Components

**Home Page** - Simple landing page
- Title: "Assessment Prototype"
- Description: "Back office planning system for assessing planning applications"
- Primary "Start" button linking to `/application/1` (first mock application)
- Uses Shadcn UI Button component with `size="lg"`

---

## Application Information Page

**Route:** `/application/[id]/information`
**Pattern:** Full-width page with tabbed navigation, opens in new tab
**Layout:** Full viewport height flexbox layout
- **Page structure:** h-screen flex flex-col with overflow-hidden
  - Site header (flex-shrink-0)
  - Case summary header (flex-shrink-0)
  - ApplicationInfoLayout (flex-1, takes remaining height)

### Core Components

**ApplicationInfoLayout** - Tabbed navigation wrapper (client component)
- **Layout structure:** Flexbox column (flex flex-col flex-1 overflow-hidden) that fills parent height
  - Takes remaining height from parent (flex-1)
  - Prevents overflow from propagating up (overflow-hidden)
- **Tab navigation:** Horizontal tabs with active indicator (3px blue bottom border)
  - Fixed height (flex-shrink-0) - doesn't grow/shrink
  - Full-width nav bar background with 1100px max-width content
- **6 tabs:** Overview, Documents, Constraints, Consultees, Neighbours, Site history
- **Tab counts:** Dynamic counts displayed in parentheses for relevant tabs
  - Documents: Total document count
  - Constraints: Count of applicable constraints (excludes "does-not-apply")
  - Consultees: Total consultees count
  - Neighbours: Total responses count
  - Overview and Site history: No count shown
- **Active state:** Foreground text color with blue border, inactive tabs use blue text with hover underline
- **Tab spacing:** 6-unit gap between tabs (gap-6, matches Application Details)
- **Content area:** Conditional layout based on active tab
  - **Constraints tab:** flex-1 overflow-hidden (fills remaining height, no scroll on container)
    - Allows ApplicationInfoConstraints to manage its own scrolling internally
    - Full width, no max-width constraint, no padding
  - **Other tabs:** flex-1 overflow-y-auto (fills height with scroll)
    - 1100px max-width, centered, px-4 py-8 padding
    - Scrollable content area

**CaseSummaryHeader** - Updated with variant and constrained support
- **Variant support:** `default` (with quick links) | `info` (without quick links)
- **Constrained support:** `constrained={true}` centers content at 1100px max-width with full-width background
- Assessment page: `default` variant, not constrained (full width)
- Application information page: `info` variant, `constrained={true}` (1100px max-width)

### Tab Section Components

**ApplicationInfoOverview** - Placeholder for granular overview
- **Title:** "Overview" (text-xl font-bold)
- **Last updated:** "Last updated: 12 October 2024" (text-sm text-muted-foreground, mt-1)
- Will include detailed proposal description, application type, requested services, metadata
- More granular than Application Details page overview

**ApplicationInfoDocuments** - Document management with search, filters, and table view (client component)
- **Title:** "Documents" (text-xl font-bold)
- **Last updated:** "Last updated: 15 October 2024" (text-sm text-muted-foreground, mt-1)
- **Search and filters bar:** Horizontal layout with 3px gap
  - Search input: Full-width with Search icon, searches document names and tags
  - Category filter: Select dropdown (180px width) - All categories, Drawings, Supporting, Evidence
  - Visibility filter: Select dropdown (180px width) - All visibility, Public, Sensitive
- **Table view:** Uses **DocumentsTable** component
- **Filtering logic:** Real-time filtering on search query, category, and visibility
- **Empty states:** "No documents match search criteria" when filtered, "No documents submitted" when none exist
- Client-side state management with React hooks

**ApplicationInfoConstraints** - Constraint management with full-width sidebar + map layout (client component)
- **Full-width layout:** Sidebar left (370px fixed) + Map right (flex-1), Google Maps style
  - No 1100px max-width constraint - uses full screen width
  - Full height (h-full) - fills remaining viewport height
- **Sidebar (Left - 370px):**
  - **Header section:** Fixed header with title and subtitle
    - Title: "Constraints" (text-lg font-bold)
    - Subtitle: "Toggle to show/hide on map" (text-xs muted)
    - Bottom border separator
  - **Scrollable content area:** Grouped constraints with clean visual hierarchy
    - Height: calc(100% - 73px) to account for header
    - Overflow-y auto for scrolling when needed
    - Divide-y borders between groups
  - **Group headers:** Minimal styling with xs font, muted-foreground color, uppercase tracking-wider
    - Small icon (h-4 w-4) + label layout
    - No background color - clean and unobtrusive
  - **Checkbox items:** Full-width clickable label wrapping checkbox + text
    - Negative margin (-mx-2) with px-2 allows hover background to extend edge-to-edge
    - Hover state: Subtle muted/50 background with rounded corners
    - Tight spacing (space-y-1) between items for density
    - Leading-tight on text for compact multi-line labels
  - **Visual hierarchy:** divide-y borders separate groups, space-y-1 separates items
  - All groups always visible (no collapsing) for quick scanning
  - Constraint details displayed as checkbox labels (falls back to constraint.label if no details)
  - Card background (bg-card) with right border separator
- **Map (Right - flex-1):**
  - Takes all remaining horizontal space
  - Full height matching sidebar
  - Muted background placeholder
  - Will display only constraints that are checked in the sidebar
- **UX best practices applied:**
  - Industry-standard pattern (Google Maps, Mapbox, planning portals)
  - Sidebar and map visible simultaneously - no context switching
  - Entire label clickable (not just checkbox) for larger hit area
  - Cursor pointer on hover for clear affordance
  - Minimal visual noise - no heavy borders or backgrounds
  - Clear grouping through dividers
  - Efficient use of widescreen space
  - Immediate visual feedback when toggling constraints
- **Constraint visibility state:** Set<string> tracks which constraints are visible on map (default: all visible)
  - Toggle handler adds/removes constraint IDs from the Set
  - State managed at component level
- **Empty state:** Centered message when no constraints exist
- Client-side state management with React hooks (constraint visibility Set)
- More granular analysis than Application Details page summary

**ApplicationInfoSiteHistory** - Placeholder component
- **Title:** "Site history" (text-xl font-bold)
- **Last updated:** "Last updated: 8 October 2024" (text-sm text-muted-foreground, mt-1)
- Will show site history and previous planning applications

**ApplicationInfoConsultees** - Consultee management with tabbed filtering and card/forum-style layout (client component)
- **Title:** "Consultees" (text-xl font-bold)
- **Last updated:** "Last updated: 14 October 2024" (text-sm text-muted-foreground, mt-1)
- **Tab navigation:** Horizontal tabs with counts for filtering consultee positions
  - 4 tabs: All, No objection, Amendments needed, Objected
  - Tab styling matches ApplicationInfoLayout pattern (3px blue border, gap-6)
  - Active tab shows count in parentheses
- **Card layout:** Modern forum-style with minimalist design, supports email-chain-like conversation view
  - Vertical stack of cards with 3-unit gap (space-y-3)
  - Each card: border, rounded corners, padding, subtle hover effect (hover:bg-muted/50)
  - **ConsulteeCard component structure:**
    - **Header section:**
      - **Left column:** Organisation name (font-semibold) with type in parentheses as secondary text (e.g., "Historic England (External)"), stacked vertically
      - **Type text:** Inline with name, smaller muted text in parentheses (Internal/External)
      - **Last response date:** Below organisation name in extra-small muted text (e.g., "Last response 15 Oct 2025")
      - **Right column:** Position badge (top-aligned)
    - **Summary:** AI-generated summary (max 30 words) in text-base with foreground color, relaxed line-height, 3-unit bottom margin
    - **Footer:** Border-top separator with "View comments (X)" link showing total comment count in blue (text-primary with hover underline)
- **Position badge component:** Color-coded with dark mode support
  - No objection: Green badge
  - Objection: Red badge
  - Amendments needed: Yellow badge
  - Not contacted: Gray badge
  - Awaiting response: Blue badge
- **Filtering logic:** Real-time filtering based on selected tab
- **Empty state:** "No consultees match this filter" when filtered
- Client-side state management with React hooks (activeTab state)
- More detailed than Application Details page summary
- **Schema updates:**
  - `type: 'internal' | 'external'` field for consultee type
  - `commentCount: number` field tracks total comments in conversation thread
  - `summary?: string` is AI-generated 2-3 line preview of the conversation

**ApplicationInfoNeighbours** - Neighbour consultation management with tabbed filtering and card/forum-style layout (client component)
- **Title:** "Neighbours" (text-xl font-bold)
- **Last updated:** "Last updated: 13 October 2024" (text-sm text-muted-foreground, mt-1)
- **Tab navigation:** Horizontal tabs with counts for filtering neighbour positions
  - 4 tabs: All, Support, Object, Neutral
  - Tab styling matches ApplicationInfoLayout and Consultees pattern (3px blue border, gap-6)
  - Active tab shows count in parentheses
- **Card layout:** Modern forum-style with minimalist design, matches Consultees pattern
  - Vertical stack of cards with 3-unit gap (space-y-3)
  - Each card: border, rounded corners, padding, subtle hover effect (hover:bg-muted/50)
  - **NeighbourCard component structure:**
    - **Header section:**
      - **Left column:** Respondent name (font-semibold) with address in parentheses as secondary text (e.g., "John Smith (45 High Street)"), stacked vertically
      - **Address text:** Inline with name, smaller muted text in parentheses
      - **Response date:** Below respondent name in extra-small muted text (e.g., "Response received 15 Oct 2025")
      - **Right column:** Position badge (top-aligned)
    - **Response text:** Full response content (not summary) with expandable/collapsible behavior
      - Text: text-base with foreground color, relaxed line-height
      - Long responses (>40 words): Truncated to 40 words with ellipsis (...) by default
      - "Show more"/"Show less" toggle appears for long responses (text-primary with hover underline)
      - Component state: isExpanded tracks whether full response is visible
      - Truncation logic: Word-based (not character-based) for cleaner breaks
    - **Topics:** Topic tags displayed as small muted badges with flex-wrap (e.g., "Design", "Privacy", "Traffic")
- **Position badge component:** Color-coded with dark mode support
  - Support: Green badge
  - Object: Red badge
  - Neutral: Gray badge
- **Filtering logic:** Real-time filtering based on selected tab (all/support/object/neutral)
- **Empty state:** "No neighbours match this filter" when filtered
- Client-side state management with React hooks (activeTab state)
- More detailed than Application Details page summary
- **Mock data updates:** Realistic neighbour responses with varied lengths, tones, and emotional content
  - Mix of formal and informal language
  - Range from brief (1-2 sentences) to lengthy (multiple paragraphs)
  - Emotional variety: angry objections with capitals/exclamation marks, measured concerns, enthusiastic support
  - Real-world concerns: construction noise, privacy, working from home, young children, property values

### Design Patterns

**Tab Navigation:** (Styled to match Application Details scrollspy navigation)
- Active tab: 3px blue bottom border (`border-primary`), black text (`text-foreground`)
- Inactive tab: transparent border, blue text (`text-primary`), underline on hover
- Font: text-base (matches Application Details)
- Padding: py-3 (matches Application Details)
- Gap: gap-6 between tabs (24px, matches Application Details)
- Border approach: `border-b-[3px]` (matches Application Details)

**Placeholder Style:**
- 400px min-height, dashed border, muted background, rounded corners
- Descriptive text explaining future content purpose

**Design Philosophy:**
- Application Information page: Granular, detailed content for deep dives
- Application Details page: High-level summaries for quick overview
- Both pages should feel consistent in styling and patterns

---

## Interactive Map Integration (2025-10-20)

**Component:** MapView - Leaflet-based interactive mapping component
**Dependencies:** leaflet, react-leaflet, @types/leaflet

### MapView Component
- **File:** [map-view.tsx](components/shared/map-view.tsx)
- **Framework:** Leaflet with React-Leaflet wrapper
- **Features:**
  - OpenStreetMap tile layer for base map
  - Rectangle overlays for constraint boundaries
  - Color-coded constraints by type (conservation: blue, listed: red, TPO: green, flood: dark blue, etc.)
  - Dynamic visibility based on sidebar checkbox state
  - Default center: Southwark, London (51.5074, -0.0901)
  - Auto-fit bounds with 50px padding
- **Props:** visibleConstraints (Set<string>), constraints (Constraint[])
- **Styling:** Full height/width, rounded corners, responsive
- **Icon fix:** Includes Leaflet default marker icon configuration for Next.js compatibility

### ApplicationInfoConstraints Updates
- **Layout:** Sidebar moved to right (370px fixed width, left border)
- **Map position:** Left side, flex-1, 30px padding all sides
- **Integration:** MapView component replaces placeholder, receives constraint visibility state
- **Height:** Map fills available screen height with overflow-hidden

### ApplicationInfoLayout Updates
- **Constraints tab:** Full-width layout (overflow-hidden) for map integration
- **Other tabs:** 1100px max-width with px-4 py-8 padding (Overview, Documents, Site history, Consultees, Neighbours)
- **Content wrapping:** Each non-constraints tab wrapped in constrained div for consistent spacing

### Mock Constraint Geometries
- Example boundaries for conservation-area, listed-building, TPO, flood-risk
- Latitude/longitude bounds format: [[lat1, lng1], [lat2, lng2]]
- Displayed as semi-transparent rectangles with colored borders

---
