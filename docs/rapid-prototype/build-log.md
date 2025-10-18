# Build Log

Track all features, components, and pages built by Forge (Builder).

## Format
**Date** | **Feature** | **Key Decisions** | **Files**

---

## Initial Scaffold - 2025-10-17

- **Scaffolded by:** Atlas (Prototype Architect)
- **Project:** assessment-prototype
- **Structure:** Next.js 15 + TypeScript + Tailwind v4 + Shadcn UI
- **Components Installed:** button, card, input, label, select, dialog, dropdown-menu, avatar, badge, separator
- **Mock Data:** Planning applications, users with roles

---

## 2025-10-17 | Site Header & Application Details Page

**Components:** SiteHeader, Application Details Page ([app/application/[id]/page.tsx](app/application/[id]/page.tsx))
**Key Decisions:** Full-width header with 1100px content constraint, system branding "Southwark Back-office Planning System"

---

## 2025-10-17 | Product Detail Layout with Collapsing Hero & Scrollspy

**Components:** ApplicationDetailLayout, ApplicationSections
**Key Decisions:**
- Collapsing hero section with map placeholder (550px square, 50% width)
- Sticky condensed header appears after 80px scroll
- Sticky scrollspy navigation: 5 sections (Overview, Documents, Assessment, History, Comments)
- Overview consolidated with hero (no separate content section)
- IntersectionObserver for scroll detection and active section tracking
- Sharp rectangular badges (blue status, yellow countdown)
- Light grey borders throughout

**Refinements:**
- Combined condensed header + navigation into single sticky container
- Vertical centering in hero, status/countdown on same line
- Application reference: `text-base`, removed `font-mono`

**Files:** [application-detail-layout.tsx](components/shared/application-detail-layout.tsx), [application-sections.tsx](components/shared/application-sections.tsx)

---

## 2025-10-17 | TypeScript Build Fixes

**Issue:** Vercel build failing with strict mode errors in IntersectionObserver callbacks
**Fix:** Added null guards for `entry` and `intersectingSections[0]` (array access can return undefined)
**Commits:** `7de396a`, `c1c87c2`

---

## 2025-10-18 | Tailwind v4 & Dark Mode

**Key Decisions:**
- Tailwind v4 structure: `@import "tailwindcss"`, `:root`/`.dark` selectors, `@theme inline` mapping
- Dark mode colors: Neutral grays (0% saturation), `bg: 5%`, `card: 8%`, `border: 20%`
- Custom typography scale: Base `1.188rem/1.563rem`, section titles `text-xl`
- Spacing system: 5px base (was 4px) - `p-4 = 20px`
- `next-themes@0.4.6`: System detection, localStorage persistence

**Components:** ThemeProvider, ThemeToggle (Sun/Moon icons in SiteHeader)

**Typography adjustments:**
- Hero address: `text-2xl`, reference: `text-base`, nav links: `text-base` (removed `font-medium`)

**All components updated with semantic tokens:** `bg-background`, `text-foreground`, `border-border`, `bg-muted`

---

## 2025-10-18 | Overview Section - Airbnb-Inspired UX

**Components:** ProposalDescription, ApplicationMetadata

**Key Decisions:**
- Flat, content-first design (no cards/heavy borders)
- "Show more/less" toggle for descriptions >200 chars
- Date formatting: en-GB locale, "Approaching" badge for expiry within 7 days
- Interactive "change" link for officer assignment

**Schema extensions:** `AssignedOfficer`, `applicationType`, `validFrom`, `consultationEnd`, `expiryDate`, `isPublic`

**Mock data:** App 1: 11 Abbey Gardens rear extension pre-app, Federico Carbo assigned

**Layout refinement:** Metadata changed from vertical list → 3-column responsive grid (stacks on mobile), icons removed for compactness

---

## 2025-10-18 | Two-Column Layout (66/33 Split)

**Key Decision:** Airbnb/Figma product detail pattern - main content left, metadata sidebar right

**Components:** ApplicationTimeline (later replaced)

**Layout:**
- Left (66%): ProposalDescription + Timeline
- Right (33%): Metadata sidebar (Assigned officer, Public portal, App type - dates removed, moved to timeline)
- Responsive: Single column mobile, side-by-side desktop (1024px+)
- 8-unit gap, non-sticky sidebar

**Timeline V1 (date-only):** Vertical circles + connecting lines, status colors (gray/blue/amber), "Active"/"Approaching" badges

---

## 2025-10-18 | GDS Color System & UI Polish

**Key Decision:** Government Digital Service (GDS) color palette implementation

**Colors:**
- Primary: GDS blue `hsl(211 66% 41%)` = `#1d70b8` (header border, all links, active nav, focus rings)
- Foreground/black: GDS black `hsl(0 0% 5%)` = `#0b0c0c`
- Link hover: Foreground color

**Typography:** Removed `font-medium` from all badges (default weight)

**Navigation:** Inactive links = blue with underline on hover, Active = primary text + bottom border

**Spacing:** Added `pt-8` to Documents section

---

## 2025-10-18 | Stage Workflow Timeline (Evolution)

**Timeline V2 → V3 → V4 (Current):** Replaced date-only timeline with stage-based workflow

**Schema:** Added stage interfaces (`ValidationStage`, `ConsultationStage`, `AssessmentStage`, `ReviewStage`) with task tracking (`StageTask`: id, title, completed, completedDate)

**Workflow dependencies:**
1. Validation (first, blocks all)
2. Consultation + Assessment (parallel after validation)
3. Review (requires both consultation + assessment)

**Timeline Evolution:**

**V2 (Integrated stages + dates):** Static stage display with dates in context, parallel branching visual, dependency messaging, Lock/Clock/CheckCircle icons

**V3 (Interactive expandable cards):** Client component with expand/collapse, task lists (checkboxes), progress bars, CTA buttons ("Continue validation"), auto-expand active stages, color-coded cards (grey=locked, blue=active, green=complete)

**V4 (Navigation-focused cards):** Removed expansion, added Next.js Link navigation to `/application/{id}/{stage}`, ChevronRight arrows, hover states, unlocked stages clickable

**Current (Flat list with contextual actions):**
- **Key Decision:** Airbnb-style flat layout - removed card backgrounds/borders, added bottom border separators
- Vertical timeline (40px column): 0.5px line + 10px circle nodes
- **Color consolidation:** Single blue accent (removed green for completed), grey for locked
- **Contextual actions:**
  - Locked: No action
  - Active: Blue button ("Check validation", "Check and assess")
  - Completed: Text link ("View or change {stage}")
- Circle alignment: `mt-1.5`, `pb-6` stage spacing

**Mock data:** App 1 realistic tasks (Validation 4/4✓, Consultation 3/5, Assessment 2/5), App 2 (validation 1/4), App 3 (all complete)

---

## 2025-10-18 | Requested Services & Badge System Unification

**Component:** RequestedServices - inline badges (Written advice, Site visit, Meeting)
**Schema:** `RequestedService` type, `requestedServices?` field

**Badge System Consolidation (3-part fix):**

1. **Sharp corners enforcement:** Removed `rounded` from RequestedServices, ApplicationMetadata, ApplicationTimeline badges, ThemeToggle, map placeholder. Timeline circles remain `rounded-full`.

2. **Dark mode fix:** Status badges added dark variants (`bg-blue-100/800` → `dark:bg-blue-900/100`, same for yellow)

3. **Unified Badge component** ([components/ui/badge.tsx](components/ui/badge.tsx)):
   - **Problem:** Inconsistent padding (`px-3 py-1` vs `px-2 py-0.5`), text sizes, inline styling
   - **Solution:** CVA-based Badge with size (`default`/`small`) and color variants (blue, yellow, green, gray, muted), all sharp corners, full dark mode
   - **Refactored:** ApplicationStatusBadges, ApplicationMetadata (`variant="gray"` for both badges), RequestedServices (`variant="muted"` → later changed to `"gray"`)

## 2025-10-18 | Spacing Refinements

**Section spacing:** Added `pt-8` to Overview section (was missing), all sections now `pt-8 pb-8` pattern

**Timeline spacing:** Added `pb-8` to Expiry Date (was 16px tight, now 32px consistent with other stages)

---

## 2025-10-18 | Divider Spacing & Final Badge Color Tweaks

**Key Decision:** Move `<hr>` dividers **outside** sections (not inside) for symmetrical spacing

**Problem:** Dividers inside sections created uneven spacing (16px above, 64px below due to `space-y-4` + padding)

**Solution:**
- Moved all `<hr>` **between** sections
- Removed `space-y-4`, added `mb-4` to section headings
- Result: 32px above divider (`pb-8`) = 32px below divider (`pt-8`) ✓

**Badge color finalization:**
- Metadata badges: Changed from `blue`/conditional `green/gray` → all `gray` for neutral sidebar appearance
- RequestedServices: Changed `variant="muted"` → `variant="gray"` to match metadata badges exactly
- **Color hierarchy:** Hero badges (blue/yellow) = high visibility, Informational badges (grey) = subdued

**Header dark mode:** Site header border lightness increased from 41% → 50% in dark mode (same GDS blue hue/saturation, less harsh)

---

## 2025-10-18 | Documents Section

**Component:** DocumentList ([components/shared/document-list.tsx](components/shared/document-list.tsx))

**Key Decisions:**
- **Three-category grouping:** Drawings, Supporting documents, Evidence
- **Flat list layout:** Consistent with Overview/Timeline sections - no cards/heavy borders
- **File metadata display:** File type badge, size, upload date, uploader name
- **File type icons:** Lucide-react icons (FileText for PDFs, Image for JPG/PNG, File for docs)
- **Download action:** Non-functional "Download" link (styling only, primary color)
- **Empty state:** "No documents uploaded yet" message when no documents exist

**Schema extensions:**
- `Document` interface: `id`, `name`, `category`, `uploadedBy`, `uploadedDate`, `fileSize`, `fileType`
- `documents?: Document[]` added to `PlanningApplication`

**Mock data:** App 1 includes 12 realistic documents:
- **Drawings (4):** Site plan, existing/proposed floor plans, elevations
- **Supporting (4):** Pre-app form, design statement, planning statement, heritage assessment
- **Evidence (4):** Site photos, garden context, street view, neighbor context

**Layout details:**
- Category sub-headings with `text-base font-semibold`
- Document rows: Icon + metadata, bottom borders between items (no border after last item)
- Metadata: File name (bold), type/size/date/uploader in muted text with bullet separators

**Files modified:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts), [lib/mock-data/applications.ts](lib/mock-data/applications.ts), [application-sections.tsx](components/shared/application-sections.tsx)

---

## 2025-10-18 | Section Reorganization & Constraints Summary

**Key Decisions:**
- **Section changes:** Removed Assessment and Comments sections
- **Renamed:** History → Site history
- **Merged:** Consultees + Neighbours → Consultation (with two subsections)
- **New section order:** Overview, Application Progress, Documents, Constraints, Site history, Consultation

**Component:** ConstraintsSummary ([components/shared/constraints-summary.tsx](components/shared/constraints-summary.tsx))

**Constraints Section - Final Design:**
- **Layout:** Two-column split (33% map + 66% detailed list)
  - Left: Square constraints map placeholder (aspect-square, dashed border)
  - Right: Vertical list with icons, grouped by constraint type
- **Only shows identified constraints** (applies/nearby/partial status) - does not display "does not apply" items
- **Grouping logic:** Multiple instances of same constraint type grouped under single heading
  - Example: "Article 4 Direction" with 2 sub-items listed below
- **Icons:** Lucide React icons (20px, muted color) for each constraint type:
  - Building2 (Conservation Area), Landmark (Listed Building), TreeDeciduous (TPO)
  - Droplets (Flood Risk), Trees (Green Belt), FileText (Article 4), Mountain (Archaeology)
- **Dividers:** Horizontal rules between each constraint type (not after last item)
- **Bottom link:** "View full constraints report" for detailed page

**Schema extensions:**
- `Constraint` interface: `id`, `type`, `label`, `status`, `details?`, `value?`
- Added `id` field to support multiple instances of same constraint type
- `constraints?: Constraint[]` added to `PlanningApplication`

**Mock data:** App 1 includes 5 identified constraints (8 total, 3 hidden as "does not apply"):
- Archaeological Priority Area — Tier 2 - Bermondsey Abbey
- Article 4 Direction (2 instances):
  - Modified Direction 1 - CAZ
  - Modified Direction 2 - KIBAs and WNCBC
- Conservation Area — Bermondsey Street Conservation Area
- Listed Building — Grade II listed building within 50m

**Design iterations:**
1. Initial: Two-column grid with status badges
2. Simplified: Removed badges, bullet list format
3. Grid with icons: Two-column grid (lg:grid-cols-2) with Lucide icons
4. Final: 33/66 split with map placeholder + grouped vertical list with dividers

**Files created:** [constraints-summary.tsx](components/shared/constraints-summary.tsx)

**Files modified:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts), [lib/mock-data/applications.ts](lib/mock-data/applications.ts), [application-sections.tsx](components/shared/application-sections.tsx), [application-detail-layout.tsx](components/shared/application-detail-layout.tsx)

---
