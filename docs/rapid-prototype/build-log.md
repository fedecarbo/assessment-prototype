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

## Key Files

**Layouts:** [application-detail-layout.tsx](components/shared/application-detail-layout.tsx), [application-sections.tsx](components/shared/application-sections.tsx)
**Schemas:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
**Mock Data:** [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
**Utilities:** [lib/utils.ts](lib/utils.ts) - formatDate, calculateResponseRate
**Styles:** [app/globals.css](app/globals.css) - Tailwind v4 theme variables

---
