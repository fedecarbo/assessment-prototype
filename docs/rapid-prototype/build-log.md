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

**Badge** - CVA-based with variants: blue, yellow, green, gray, muted, black
**ThemeToggle** - Dark mode (next-themes) with sun/moon icons

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
**Documents:** id, name, category, tags[], fileSize, fileType
**Constraints:** id, type, label, status, details?, value?
**Consultees:** ConsulteeResponse with position, responseDate, summary
**Neighbours:** NeighbourResponse with position, topics[]

---

## Assessment Page

**Route:** `/application/[id]/assessment`
**Layout Pattern:** Full-width layout with site header, breadcrumbs, and case summary

### Core Components

**AssessmentLayout** - Full-width layout wrapper with two-column structure and independent scrolling (client component)
- **Fixed headers:** Site header, breadcrumbs, and case summary remain at top (flex-none)
- **Viewport height:** Uses `h-screen` with flexbox column layout
- **Two-column scrollable layout:**
  - Left: TaskPanel (370px total: 338px + 32px padding, `overflow-y-auto`)
  - Right: Main content area (`flex-1`, takes remaining space, centered, `overflow-y-auto`)
  - Content constraint: 1100px max-width with 16px horizontal padding (px-4), centered within main area
  - Responsive: Content stays centered and constrained on all screen sizes
- **Independent scrolling:** Each content area scrolls independently with its own scrollbar
- **Task selection state:** Manages `selectedTaskId` state (default: 1)
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
- Slash separators between items
- Links to previous pages, current page as plain text

**CaseSummaryHeader** - Condensed application header (client component)
- Reference number + address in single line (left side)
- Quick links: "Application information", "Documents" (right side)
- Optional "Show/Hide proposal description" toggle button
- Expandable description panel with smooth transition (300ms)
- Description constrained to max-w-4xl (896px) for readability
- Replaces the collapsing hero pattern from detail page

**TaskPanel** - Fixed sidebar for assessment tasks with independent scroll
- Fixed width: 338px + 16px padding each side = 370px total
- Independent scrolling: `overflow-y-auto`
- Border right separator
- **Grouped task structure:** Tasks organized under parent titles (3 groups: Check application, Additional services, Assessment summaries)
- **Interactive task list:** Text links to select task (8 tasks total)
- **Link behavior:** Uses Next.js Link with query params `?task={id}`, maintains onClick callback
- **Visual states:**
  - Selected: Black (foreground) text with font-semibold, no underline
  - Unselected: Blue (primary) text with hover to black, underline with 3px offset
  - Links: text-sm size with py-1.5 padding
  - Group titles: text-sm font-bold, 10px bottom margin
- **Spacing hierarchy:**
  - Main "Tasks" heading to first group: 20px (mb-5)
  - Between task groups: 16px separator with my-4
  - Group title to tasks: 10px (mb-2.5)
  - Between tasks within group: 4px separator with my-1
- **Status icons** (right-aligned):
  - Completed: Black checkmark icon (lucide-react Check)
  - In progress: Blue circle-dot icon (lucide-react CircleDot)
  - Not started: Gray circle outline icon (lucide-react Circle)
- **Dividers:** Separator components between tasks within groups (my-1) and between groups (my-4)
- Scrolls independently from main content area
- Callbacks: `onTaskSelect(taskId)` updates parent state

**AssessmentContent** - Dynamic task content renderer (client component)
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
- Mock data: 8 realistic planning assessment tasks organized in 3 groups
  - Check application: Check application details (completed), Check consultees consulted (completed), Check site history (in-progress)
  - Additional services: Site visit (not-started), Meeting (not-started)
  - Assessment summaries: Site description (not-started), Summary of advice (not-started), Planning considerations and advice (not-started)
- Provides `selectedTaskId`, `setSelectedTaskId`, and `taskGroups` array
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
