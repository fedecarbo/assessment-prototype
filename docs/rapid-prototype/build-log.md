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

## 2025-10-18 | Sticky Header Consolidation

**Component:** ApplicationDetailLayout ([components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx))

**Key Decisions:**
- **Unified sticky container:** Merged condensed header and section navigation into single sticky block with shared background and border
- **Eliminated visual separation:** Removed gap between address/reference and navigation when hero collapses
- **Tighter spacing:** Reduced bottom padding of condensed header from `pb-3` to `pb-2` (10px gap to nav)
- **Simplified condensed header:** Removed status badges (In assessment / days to determination) - only shows address + reference

**Problem solved:** Condensed header felt "floaty" and disconnected from navigation due to separate containers with independent padding/backgrounds

**Result:** Cohesive sticky header unit with address/reference flowing naturally into navigation tabs

**Files modified:** [application-detail-layout.tsx](components/shared/application-detail-layout.tsx)

---

## 2025-10-18 | Document List Redesign - Filename-First Layout

**Component:** DocumentList ([components/shared/document-list.tsx](components/shared/document-list.tsx))

**Key Decisions:**
- **Filename as title link:** Document filename displayed as primary clickable link (blue, hover underline)
- **Tags below filename:** Document contents displayed as grey badge tags (using Badge component)
- **Minimal metadata:** Removed icon, file type, uploader name, file size, and upload date
- **Layout:** Filename link on first line, tags on second line
- **Realistic filenames:** Technical naming convention (DRA-001, SUP-002, PHO-003 prefixes)

**Schema changes:**
- Added `tags?: string[]` field to Document interface
- Removed `uploadedBy` field from Document interface

**Mock data updates:**
- **Drawings:** DRA-001-Site_Plan.pdf, DRA-002-Proposed_Existing_Drawings.pdf (with 4 tags), DRA-003-Sections.pdf
- **Supporting:** SUP-001-Pre_Application_Form.pdf, SUP-002-Design_Access_Statement.pdf (2 tags), SUP-003-Planning_Statement.pdf, SUP-004-Heritage_Impact_Assessment.pdf
- **Evidence:** PHO-001-Rear_Elevation.jpg, PHO-002-Garden_Context.jpg, PHO-003-Street_View.jpg (2 tags), PHO-004-Neighbor_Context.jpg (2 tags)
- **Tag examples:** "Elevations - existing", "Floor plan - proposed", "Site photos", "Heritage assessment"

**Files modified:** [document-list.tsx](components/shared/document-list.tsx), [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts), [lib/mock-data/applications.ts](lib/mock-data/applications.ts)

---

## 2025-10-18 | Documents Section Spacing Refinement

**Key Decisions:**
- **Section heading spacing:** Increased `mb-4` → `mb-6` (16px → 24px) between "Documents" and category groups
- **Category group spacing:** Reduced outer container `space-y-8` → `space-y-6` (32px → 24px between category groups)
- **Category heading spacing:** Reduced `mb-4` → `mb-3` (16px → 12px) between category heading and first document
- **Visual hierarchy:** Category headings stay close to their content, adequate breathing room between groups

**Result:** Consistent spacing pattern matching other sections - section headings have proper breathing room, category subheadings stay close to their content

**Files modified:** [application-sections.tsx](components/shared/application-sections.tsx), [document-list.tsx](components/shared/document-list.tsx)

---

## 2025-10-18 | Collapsible Document Categories

**Component:** DocumentList ([components/shared/document-list.tsx](components/shared/document-list.tsx))

**Key Decisions:**
- **Client-side interactivity:** Converted to client component with useState for expand/collapse
- **Default state:** Drawings expanded, Supporting documents and Evidence collapsed
- **Category headers:** Clickable with chevron icons (ChevronRight collapsed, ChevronDown expanded)
- **Document counts:** Show count in parentheses next to category name (e.g., "Evidence (4)")
- **Visual feedback:** Header hover state changes text to primary blue
- **Indentation:** Expanded documents indented with `ml-7` to align with category name
- **Condensed spacing:** `py-3` per document (was `py-4`), `mb-1.5` filename to tags (was `mb-2`)

**Result:** More focused initial view showing only drawings, with clear indication of additional documents available in collapsed categories

**Files modified:** [document-list.tsx](components/shared/document-list.tsx)

---

## 2025-10-18 | Document Thumbnails

**Component:** DocumentList ([components/shared/document-list.tsx](components/shared/document-list.tsx))

**Key Decisions:**
- **Thumbnail placement:** 64px × 64px placeholder thumbnail on left of each document row
- **Placeholder styling:** Muted background with border (`bg-muted border-border`)
- **Layout:** Flexbox with `gap-3` between thumbnail and document info
- **Responsive:** Thumbnail is `flex-shrink-0`, document info uses `flex-1 min-w-0` for text truncation

**Files modified:** [document-list.tsx](components/shared/document-list.tsx)

---

## 2025-10-19 | Neighbour Consultation - Side-by-Side Layout with Plain English Summary

**Component:** NeighbourConsultation ([components/shared/neighbour-consultation.tsx](components/shared/neighbour-consultation.tsx))

**Key Decisions:**
- **Compact statistics line:** Single-line inline metrics (34 notified • 8 responses (24%) • 5 object • 2 support • 1 comment)
- **Color-coded sentiment:** Object in red, Support in green, inline with statistics
- **Side-by-side layout (50/50):** Topic list on left, AI summary on right
- **Airbnb-style topic list:** Simple two-column layout showing topic name and comment count, sorted by frequency
- **Plain English AI summary:** Full paragraph written in accessible language, avoiding jargon
- **Only topics with comments shown:** Filtered to exclude zero-count topics for cleaner presentation
- **Visual balance:** Statistics above, topic list + summary below in equal columns

**Schema extensions:**
- `ConsultationTopic` type: 7 standardized topics (design, privacy, loss-of-light, traffic, accessibility, noise, other) - removed conservation-area
- `TopicSummary` interface: Topic metadata with label, count, AI-generated summary
- `NeighbourResponse` interface: Added `topics[]` array to tag responses with relevant concerns
- `NeighbourConsultation` interface: Contains `briefSummary` and `topicSummaries: TopicSummary[]`

**Mock data:** App 1 includes realistic topic breakdown:
- **Statistics:** 34 notified, 8 responses (24% response rate), 2 support, 5 object, 1 comment
- **Plain English summary:** Full paragraph explaining overall sentiment, main concerns (loss of light as primary issue affecting properties 9 and 13), privacy concerns, design feedback about modern materials, construction impacts, and support reasoning
- **5 topics with comments (sorted by count):**
  - Loss of light: 4
  - Design: 3
  - Privacy: 2
  - Noise: 2
  - Traffic: 1
- **8 detailed responses:** Each tagged with 1-3 relevant topics

**Layout details:**
- Statistics use inline text with bullet separators and medium-weight numbers
- Two-column grid: `grid-cols-1 lg:grid-cols-2 gap-8` (stacks on mobile, side-by-side on desktop)
- Left column: "Most commented topics" heading + Airbnb-style list (topic name left, count right)
- Right column: "Summary" heading with "AI generated" badge + full paragraph in plain English
- Topics list: `py-4` padding per row, `border-b` between items (no border after last)
- Topics automatically sorted descending by count
- Consistent heading spacing: `mb-4` for both columns

**Files created:** [neighbour-consultation.tsx](components/shared/neighbour-consultation.tsx)

**Files modified:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts), [lib/mock-data/applications.ts](lib/mock-data/applications.ts), [application-sections.tsx](components/shared/application-sections.tsx)

---

## 2025-10-19 | Split Consultation into Separate Consultees and Neighbours Sections

**Components:** ApplicationDetailLayout ([application-detail-layout.tsx](components/shared/application-detail-layout.tsx)), ApplicationSections ([application-sections.tsx](components/shared/application-sections.tsx))

**Key Decisions:**
- **Separated consultation types:** Split single "Consultation" section into two distinct top-level sections
- **Navigation update:** Added separate nav items for "Consultees" and "Neighbours" (replacing single "Consultation")
- **Section IDs:** `consultees` and `neighbours` for proper scrollspy and anchor behavior
- **Visual hierarchy:** Both sections get full section treatment with `text-xl font-bold` headings and proper spacing
- **Consistent dividers:** Horizontal rule before each section maintains visual separation

**Layout changes:**
- Removed subsection structure (h3 headings for Consultees/Neighbours within Consultation)
- Promoted both to full sections with h2 headings
- Navigation now shows 7 items: Overview, Application Progress, Documents, Constraints, Site history, Consultees, Neighbours
- Each section maintains `scroll-mt-[160px]` for sticky header offset
- Consultees placeholder remains (for future implementation)
- Neighbours section contains NeighbourConsultation component

**Files modified:** [application-detail-layout.tsx](components/shared/application-detail-layout.tsx), [application-sections.tsx](components/shared/application-sections.tsx)

---

## 2025-10-19 | Update Neighbour Sentiments to Three Categories

**Component:** NeighbourConsultation ([components/shared/neighbour-consultation.tsx](components/shared/neighbour-consultation.tsx))

**Key Decisions:**
- **Three sentiment categories:** Changed from support/object/comment to support/object/neutral
- **Schema alignment:** Updated `NeighbourResponse.position` and `NeighbourConsultation` to use consistent terminology
- **Statistics display:** Changed "comment" to "neutral" in compact statistics line
- **Clearer categorization:** "Neutral" better represents responses that neither support nor object

**Schema changes:**
- `NeighbourResponse.position`: Changed from `'support' | 'object' | 'comment'` to `'support' | 'object' | 'neutral'`
- `NeighbourConsultation`: Renamed `commentCount` to `neutralCount`

**Mock data updates:**
- Statistics now show: 5 object, 2 support, 1 neutral
- Emma Roberts response changed from `position: 'comment'` to `position: 'neutral'`

**Display updates:**
- Statistics line now shows: "34 notified • 8 responses (24%) • 5 object • 2 support • 1 neutral"
- Neutral count displayed in default text color (no special color-coding)

**Files modified:** [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts), [lib/mock-data/applications.ts](lib/mock-data/applications.ts), [neighbour-consultation.tsx](components/shared/neighbour-consultation.tsx)

---
