# Build Log

Track all features, components, and pages built by Forge (Builder).

## Format
**Date** | **Feature/Component** | **Description** | **Files Changed**

---

## Initial Scaffold - 2025-10-17

- **Scaffolded by:** Atlas (Prototype Architect)
- **Project:** assessment-prototype
- **Structure:** Next.js 15 + TypeScript + Tailwind v4 + Shadcn UI
- **Components Installed:** button, card, input, label, select, dialog, dropdown-menu, avatar, badge, separator
- **Mock Data:** Planning applications, users with roles
- **Status:** Ready for development

---

## 2025-10-17 | Site Header & Application Details Page

**Built by:** Forge (Builder)

### Components Created
- **SiteHeader** ([components/shared/site-header.tsx](components/shared/site-header.tsx))
  - Full-width header with border
  - System branding: "Southwark Back-office Planning System"
  - User info and log out button
  - Content constrained to 1100px max-width

### Pages Created
- **Application Details Page** ([app/application/[id]/page.tsx](app/application/[id]/page.tsx))
  - Dynamic route for individual applications
  - Integrated SiteHeader component
  - Main content area with 1100px max-width constraint
  - Ready for content sections

**Status:** Header and page layout complete. Ready for application detail sections.

---

## 2025-10-17 | Product Detail Layout with Collapsing Hero & Scrollspy

**Built by:** Forge (Builder)

### Components Created
- **ApplicationDetailLayout** ([components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx))
  - Collapsing hero section with application details and map placeholder
  - Sticky condensed header that appears when hero scrolls out of view
  - Sticky scrollspy navigation with 5 sections (Overview, Documents, Assessment, History, Comments)
  - IntersectionObserver for hero collapse detection
  - IntersectionObserver for scrollspy active section tracking
  - Deep-linkable section anchors with `scroll-margin-top` for proper offset
  - Accessibility features: `aria-current` on active nav, `aria-labelledby` on sections
  - 1100px max-width content container

- **ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
  - Five placeholder content sections with proper IDs
  - Accessible heading structure
  - Scroll-margin for proper anchor positioning

### Layout Features
- **Hero Section:**
  - Left column: Address (11 Abbey Gardens, London, SE16 3RQ), Application reference, Status badge, Days to determination
  - Right column: Square map placeholder (550px, 50% of content width)
  - Collapses on scroll

- **Sticky Condensed Header:**
  - Appears when hero scrolls past 80px
  - Compact view with address, reference, status, and days countdown
  - Z-index 40, positioned above content

- **Sticky Section Navigation:**
  - Five sections: Overview, Documents, Assessment, History, Comments
  - Active section highlighted with blue underline
  - Smooth scroll navigation
  - Z-index 30

- **Technical Implementation:**
  - `position: sticky` for persistent headers
  - IntersectionObserver for scroll detection
  - `scroll-margin-top: 100px` for anchor offset
  - Client component for interactivity

### Pages Updated
- **Application Details Page** ([app/application/[id]/page.tsx](app/application/[id]/page.tsx))
  - Integrated ApplicationDetailLayout component
  - Integrated ApplicationSections component
  - Sample data: 11 Abbey Gardens address, "In assessment" status, 12 days to decision

**Status:** Product detail layout complete with collapsing hero, sticky navigation, and scrollspy. Ready for content implementation in sections.

### Refinements - 2025-10-17

- **Layout & Styling:**
  - Vertically centered hero left column content
  - Rectangular labels (removed rounded corners): blue for status, yellow for days countdown
  - White background throughout (hero and page)
  - Status and days countdown on same line

- **Overview Section:**
  - Consolidated with hero section (no separate Overview content section)
  - Clicking "Overview" nav scrolls to top
  - Scrollspy highlights Overview when hero is visible

- **Sticky Header Architecture:**
  - Combined condensed header and navigation into single sticky container
  - Eliminates gap between elements during scroll
  - Condensed header appears when hero scrolls out of view
  - Navigation always visible below condensed header (when present)

### Content Addition - 2025-10-17

- **Overview Details Section:**
  - Added placeholder box below navigation for overview details
  - Proposal description area (dashed border placeholder)
  - Planning officer assignment with avatar placeholder
  - Displays immediately below sticky navigation
  - Part of Overview section content

### Visual Polish - 2025-10-17

- **Border Styling:**
  - Updated all section borders to light grey (`border-gray-200`)
  - Navigation border changed to light grey
  - Consistent border colors throughout the interface

- **Typography:**
  - Application reference changed to `text-base` in hero and condensed header
  - Removed monospace font (`font-mono`) from application reference
  - Better visual hierarchy and readability

**Files Modified:**
- [application-sections.tsx](components/shared/application-sections.tsx) - Border colors, overview details
- [application-detail-layout.tsx](components/shared/application-detail-layout.tsx) - Navigation border, reference typography

---

## 2025-10-17 | Vercel Deployment Fixes

**Built by:** Forge (Builder)

### TypeScript Build Errors Resolved

**Issue:** Vercel build failing with TypeScript strict mode errors in IntersectionObserver callbacks.

### Fixes Applied

1. **Hero Collapse Observer** ([application-detail-layout.tsx:47](components/shared/application-detail-layout.tsx#L47))
   - **Error:** `'entry' is possibly 'undefined'`
   - **Fix:** Added null guard before accessing `entry.isIntersecting`
   - **Code:** Wrapped state update in `if (entry)` check

2. **Scrollspy Observer** ([application-detail-layout.tsx:90](components/shared/application-detail-layout.tsx#L90))
   - **Error:** `Object is possibly 'undefined'`
   - **Fix:** Added null guard for `intersectingSections[0]`
   - **Code:** Extracted to `topSection` variable with null check before accessing `.id`

### Technical Details
- Both errors caused by TypeScript strict null checking in IntersectionObserver callbacks
- Array destructuring and array access can potentially return undefined
- Added defensive guards to satisfy TypeScript compiler
- No functional changes - guards are defensive programming best practice

**Commits:**
- `7de396a` - Fix TypeScript error in IntersectionObserver callback
- `c1c87c2` - Fix second TypeScript error in scrollspy observer

**Status:** All build errors resolved. Application successfully deployed to Vercel.

---

## 2025-10-18 | Tailwind v4 Configuration & Dark Mode Implementation

**Built by:** Forge (Builder)

### Global Styles Configuration

**Tailwind CSS v4 Setup** ([app/globals.css](app/globals.css))
- Updated to proper Tailwind v4 structure with `@import "tailwindcss"` and `@config` directive
- Migrated from `@theme` block to `:root` and `.dark` selectors (shadcn/ui v4 pattern)
- Added `@theme inline` block for mapping CSS variables to Tailwind theme system
- Configured complete color palette for light and dark modes with neutral grays (0% saturation)

**Dark Mode Colors:**
- Background: `0 0% 5%` (very dark neutral, no blue tint)
- Cards: `0 0% 8%` (subtle contrast)
- Muted/Secondary: `0 0% 14%`
- Borders: `0 0% 20%`
- Foreground text: `0 0% 98%`
- All colors use neutral grays with zero saturation

**Typography Scale:**
- Custom text sizes with line heights
- Base: `1.188rem` / `1.563rem`
- Large: `1.5rem` / `1.875rem`
- XL: `1.688rem` / `1.875rem`
- 2XL through 9XL with corresponding line heights

**Spacing System:**
- Changed base spacing from `0.25rem` (4px) to `0.3125rem` (5px)
- Each increment now equals 5px (p-1 = 5px, p-2 = 10px, p-4 = 20px, etc.)

### Dark Mode Implementation

**Dependencies Added:**
- `next-themes@0.4.6` - Theme management with system preference detection and localStorage persistence

**Components Created:**

1. **ThemeProvider** ([components/theme-provider.tsx](components/theme-provider.tsx))
   - Client-side wrapper for NextThemesProvider
   - Enables theme switching across the application

2. **ThemeToggle** ([components/shared/theme-toggle.tsx](components/shared/theme-toggle.tsx))
   - Sun/Moon icon toggle button
   - Proper hydration handling to prevent flash
   - Hover states with subtle background
   - Accessible with `aria-label`

**Configuration Files:**

- **Root Layout** ([app/layout.tsx](app/layout.tsx))
  - Added ThemeProvider wrapper with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
  - Added `suppressHydrationWarning` to html tag
  - Applied `bg-background text-foreground` to body

- **Tailwind Config** ([tailwind.config.ts](tailwind.config.ts))
  - Created config with `darkMode: 'class'`
  - Defined content paths for proper CSS generation

### Component Updates for Dark Mode

**Updated Components:**
- **SiteHeader** ([components/shared/site-header.tsx](components/shared/site-header.tsx))
  - Added ThemeToggle button between user name and logout
  - Applied neutral dark background: `dark:bg-[hsl(0,0%,5%)]`
  - Changed text color: `dark:text-foreground`

- **ApplicationDetailLayout** ([components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx))
  - Replaced all hardcoded grays with theme-aware tokens
  - `bg-background`, `text-foreground`, `text-muted-foreground`
  - `border-border`, `bg-muted` for subtle surfaces
  - Sticky headers and navigation fully dark mode compatible

- **ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
  - Updated all section cards to use `bg-card`, `text-card-foreground`
  - Placeholder areas use `bg-muted`, `text-muted-foreground`
  - Borders use `border-border` throughout

- **Application Pages:**
  - Home page ([app/page.tsx](app/page.tsx)): Added `bg-background text-foreground`
  - Application detail page ([app/application/[id]/page.tsx](app/application/[id]/page.tsx)): Changed to `bg-background`

### Typography Refinements

**Text Size Updates:**
- Address in hero: Changed from `text-3xl` to `text-2xl`
- Address in condensed header: Changed from `text-lg font-semibold` to `text-base font-bold`
- Application reference label and value: Both set to `text-base`
- Status badge labels: Changed from `text-sm` to `text-base`
- Scroll navigation links: Changed from `text-sm` to `text-base`, removed `font-medium` (now default weight)
- Section titles (Documents, Assessment, History, Comments): Changed from `text-2xl` to `text-xl`

### Technical Implementation

**Features:**
- System theme detection (respects OS dark/light preference)
- LocalStorage persistence (theme choice saved between sessions)
- No flash on page load (proper SSR handling)
- Smooth transitions between themes
- Complete color neutrality (zero saturation for dark mode grays)

**Files Modified:**
- [app/globals.css](app/globals.css)
- [app/layout.tsx](app/layout.tsx)
- [tailwind.config.ts](tailwind.config.ts) (created)
- [components/theme-provider.tsx](components/theme-provider.tsx) (created)
- [components/shared/theme-toggle.tsx](components/shared/theme-toggle.tsx) (created)
- [components/shared/site-header.tsx](components/shared/site-header.tsx)
- [components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)
- [components/shared/application-status-badges.tsx](components/shared/application-status-badges.tsx)
- [app/page.tsx](app/page.tsx)
- [app/application/[id]/page.tsx](app/application/[id]/page.tsx)

**Status:** Dark mode fully implemented with neutral color scheme. Custom typography scale and 5px-based spacing system configured. All components theme-aware.

---

## 2025-10-18 | Overview Section - Airbnb-Inspired UX

**Built by:** Forge (Builder)

### Components Created

1. **ProposalDescription** ([components/shared/proposal-description.tsx](components/shared/proposal-description.tsx))
   - Clean typography for proposal text
   - "Show more/less" toggle for long descriptions (>200 chars)
   - Client-side interactivity with line-clamp
   - No card wrapper - flat, content-first design
   - Dark mode compatible

2. **ApplicationMetadata** ([components/shared/application-metadata.tsx](components/shared/application-metadata.tsx))
   - Flat, list-based layout with icon + label + value pattern
   - Displays: Assigned officer, Public portal status, Application type
   - Displays dates: Valid from, Consultation end, Expiry date
   - Date formatting with locale support (en-GB)
   - "Approaching" badge for expiry dates within 7 days
   - Interactive "change" link for officer assignment
   - Inline badges for categorical data (public status, app type)
   - SVG icons for visual interest and scannability
   - Horizontal dividers between logical groups
   - Generous whitespace, no backgrounds or borders
   - Full dark mode support with theme-aware colors

### Mock Data Schema Updates

**Extended PlanningApplication Schema** ([lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)):
- Added `AssignedOfficer` interface with `id`, `name`, `avatar?`
- Added fields to `PlanningApplication`:
  - `applicationType: string` - Full name (e.g., "Pre-application Advice")
  - `validFrom: string` - ISO date string
  - `consultationEnd: string` - ISO date string
  - `expiryDate: string` - ISO date string
  - `isPublic: boolean` - Public portal visibility
  - `assignedOfficer?: AssignedOfficer` - Detailed officer info

**Updated Mock Data** ([lib/mock-data/applications.ts](lib/mock-data/applications.ts)):
- Application 1: Realistic pre-app for 11 Abbey Gardens with rear extension proposal
- Added all new fields with proper dates and metadata
- Assigned Federico Carbo as planning officer
- Set isPublic to false, applicationType to "Pre-application Advice"
- Updated applications 2 and 3 with new required fields

### Component Updates

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx)):
- Now accepts `application: PlanningApplication` prop
- Removed placeholder dashed boxes
- Integrated ProposalDescription component
- Integrated ApplicationMetadata component
- Clean layout with horizontal dividers
- Proper spacing between sections
- TypeScript props interface

**Application Detail Page** ([app/application/[id]/page.tsx](app/application/[id]/page.tsx)):
- Loads application from `mockApplications` by ID
- Passes full application object to ApplicationSections
- Fallback to first application if ID not found
- Displays actual address and reference from data

### Design Patterns

**Airbnb-Inspired UX:**
- Flat, content-first design (no cards or heavy borders)
- Icon + label + value pattern for metadata
- Generous whitespace and padding
- Horizontal dividers for section separation
- Inline badges for categorical information
- Interactive elements clearly indicated (hover states)
- Clean typography hierarchy
- Scannable layout for complex planning data

**Technical Features:**
- Date formatting utility with locale support
- Date proximity detection (7-day threshold for expiry warnings)
- Responsive flex layouts
- SVG icons for lightweight visuals
- Client component for interactivity (show more/less)
- Full TypeScript type safety
- Dark mode with semantic color tokens

**Files Created:**
- [components/shared/proposal-description.tsx](components/shared/proposal-description.tsx)
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)
- [app/application/[id]/page.tsx](app/application/[id]/page.tsx)

**Status:** Overview section complete with production-ready UX. Metadata displays assigned officer, public status, application type, and key dates with expiry warnings. Proposal description includes expand/collapse for long text. Clean, Airbnb-style flat design with no cards.

### Layout Refinement - 2025-10-18

**Updated:** ApplicationMetadata component to horizontal grid layout

- Changed from vertical list to responsive 3-column grid layout
- Top row: Assigned officer, Public portal status, Application type
- Bottom row: Valid from, Consultation end, Expiry date
- Removed icons for cleaner, more compact presentation
- Responsive: Stacks to single column on mobile, 3 columns on desktop
- Maintained all functionality: badges, "change" link, expiry warnings
- Better space efficiency - reduced vertical height significantly

**Files Modified:**
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)

---

## 2025-10-18 | Two-Column Layout with Timeline Progress Tracker

**Built by:** Forge (Builder)

### Major Layout Redesign

Restructured Overview section to use a **product detail page pattern** with 66/33 two-column split, inspired by Airbnb and Figma Community layouts.

### Components Created

**ApplicationTimeline** ([components/shared/application-timeline.tsx](components/shared/application-timeline.tsx))
- Visual timeline progress tracker for application lifecycle
- Three milestones with status-based styling:
  - **Valid from:** 6 October 2025 (past - gray)
  - **Consultation end:** 27 October 2025 (current - blue with "Active" badge)
  - **Expiry date:** 30 October 2025 (warning - amber with "Approaching" badge)
- Vertical timeline design with:
  - Circle indicators (filled/outlined based on status)
  - Connecting lines between milestones
  - Status badges ("Active", "Approaching")
  - Formatted dates (UK locale)
- Color coding system:
  - Past milestones: Muted gray
  - Current milestones: Blue with "Active" badge
  - Approaching expiry: Amber with "Approaching" badge (within 7 days)
  - Upcoming: Default border-only circles
- Date formatting utility with locale support
- Status detection logic for milestone states
- Full dark mode compatibility

### Component Updates

**ApplicationMetadata** ([components/shared/application-metadata.tsx](components/shared/application-metadata.tsx))
- Simplified to sidebar-only component (removed all date fields)
- Now displays only 3 metadata items:
  - Assigned to: Federico Carbo (with "change" link)
  - Public on BOPS Public Portal: No (badge)
  - Application type: Pre-application Advice (badge)
- Clean vertical stack layout (removed grid)
- Optimized for narrow sidebar presentation
- Removed date formatting utilities (moved to timeline)

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
- Implemented two-column grid layout: `grid-cols-1 lg:grid-cols-3`
- **Left column** (66% - `lg:col-span-2`):
  - ProposalDescription component
  - ApplicationTimeline component
  - Horizontal divider between sections
- **Right column** (33% - `lg:col-span-1`):
  - ApplicationMetadata component (sidebar)
- Responsive behavior:
  - Mobile: Single column, natural stacking
  - Desktop (1024px+): Side-by-side 66/33 split
- Generous 8-unit gap between columns

### Design Pattern

**Product Detail Page Layout:**
- Main content area on left with proposal text and timeline
- Metadata sidebar on right with key details
- Non-sticky sidebar (no fixed positioning)
- Clean whitespace separation (no vertical dividers)
- Maintains flat, Airbnb-style aesthetic
- Full responsive support

**Timeline Visual Language:**
- Status-driven color system
- Clear visual progression through application phases
- Scannable vertical layout
- Informative badges for active/warning states
- Professional, government-appropriate design

**Technical Features:**
- Component composition pattern
- Tailwind grid system with responsive columns
- Reusable date utilities
- Status detection algorithms
- Type-safe props interfaces
- Dark mode with semantic tokens

**Files Created:**
- [components/shared/application-timeline.tsx](components/shared/application-timeline.tsx)

**Files Modified:**
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)

**Status:** Two-column layout complete with visual timeline progress tracker. Overview section now follows product detail page patterns with main content (proposal + timeline) on left and metadata sidebar on right. Timeline provides clear visual representation of application lifecycle with status-based styling.

---

## 2025-10-18 | UI Polish & GDS Color System

**Built by:** Forge (Builder)

### Spacing Fix
- Added `pt-8` to Documents section for consistent spacing with other sections

### Typography Updates
- Removed `font-medium` from all badges (status, dates, public portal, application type)
- Changed badge text to default font weight throughout the application

### Navigation Styling Refinement
**Scroll Navigation** ([application-detail-layout.tsx](components/shared/application-detail-layout.tsx))
- **Inactive links:** Now styled as standard links (blue text with underline on hover)
- **Active section:** Uses primary text color with blue border indicator at bottom
- Clear visual distinction between clickable links and active section

### GDS Color System Implementation
**Global Color System** ([app/globals.css](app/globals.css))
- Implemented Government Digital Service (GDS) color palette
- Updated `--primary` to GDS blue: `211 66% 41%` (`#1d70b8`)
- Updated `--foreground` and all black colors to GDS black: `0 0% 5%` (`#0b0c0c`)
- Updated `--ring` to match primary for consistent focus states
- Removed custom color variables - using standard Tailwind color system

**Color Applications:**
- Brand color (GDS blue `#1d70b8`) now used for:
  - Site header border (`border-b-primary`)
  - All links (`text-primary`)
  - Active navigation borders
  - Focus rings
- Link hover uses foreground (GDS black `#0b0c0c`)
- All black text uses GDS black specification

**Components Updated:**
- [site-header.tsx](components/shared/site-header.tsx) - Border uses `border-b-primary`
- [application-metadata.tsx](components/shared/application-metadata.tsx) - "change" link uses `text-primary`
- [proposal-description.tsx](components/shared/proposal-description.tsx) - "Show more/less" link uses `text-primary`
- [application-detail-layout.tsx](components/shared/application-detail-layout.tsx) - Navigation links use `text-primary`

**Design Benefits:**
- Consistent brand color throughout application
- Uses existing Tailwind color structure (no custom variables)
- Accessible, government-standard color palette
- Simple, maintainable color system

**Files Modified:**
- [app/globals.css](app/globals.css)
- [components/shared/site-header.tsx](components/shared/site-header.tsx)
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)
- [components/shared/proposal-description.tsx](components/shared/proposal-description.tsx)
- [application-detail-layout.tsx](components/shared/application-detail-layout.tsx)
- [application-sections.tsx](components/shared/application-sections.tsx)
- [application-status-badges.tsx](components/shared/application-status-badges.tsx)

**Status:** UI polish complete with GDS color system fully implemented. All badges use default font weight. Navigation links styled consistently. Brand color (GDS blue) integrated throughout using standard Tailwind utilities.

---

## 2025-10-18 | Integrated Stage Workflow Timeline

**Built by:** Forge (Builder)

### Major Timeline Redesign

Replaced date-only timeline with integrated stage-workflow timeline that shows both application progress stages AND key dates in context.

### Components Created

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))
- Integrated workflow timeline showing 4 main stages with dates:
  - **Validation:** First stage, blocks all others until complete
  - **Consultation:** Can start after validation (parallel with Assessment)
  - **Assessment:** Can start after validation (parallel with Consultation)
  - **Review:** Requires both Consultation and Assessment to be complete
- Visual parallel branching for Consultation + Assessment stages
- Stage status indicators:
  - **Locked** (grey + lock icon): Cannot access, dependencies not met
  - **Active** (blue + clock icon): Currently in progress
  - **Completed** (green + checkmark icon): Stage finished
- Smart date display within each stage context:
  - Validation: Shows "Valid from" or "Validated" date
  - Consultation: Shows "Started" or "Ends" date, "Approaching" badge if ending soon
  - Assessment: Shows "Started" date
  - Review: Shows "Started" date
- Dependency messaging:
  - Locked stages show why they're blocked (e.g., "Requires validation")
  - Review stage shows "Requires consultation & assessment"
- Expiry warning callout at bottom if approaching (within 7 days)
- Icon set: Lock (locked), Clock (active), CheckCircle (completed)
- Full dark mode compatibility

### Schema Updates

**PlanningApplication Interface** ([lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts))
- Added stage tracking fields:
  - `validationStatus: 'pending' | 'validated' | 'rejected'`
  - `validationDate?: string` (ISO date)
  - `consultationStatus: 'not-started' | 'in-progress' | 'completed'`
  - `consultationStartDate?: string`
  - `assessmentStatus: 'not-started' | 'in-progress' | 'completed'`
  - `assessmentStartDate?: string`
  - `reviewStatus: 'not-started' | 'in-progress' | 'completed'`
  - `reviewStartDate?: string`

### Mock Data Updates

**Applications Data** ([lib/mock-data/applications.ts](lib/mock-data/applications.ts))
- **Application 1 (PA-2025-001):** Validated, both Consultation and Assessment in progress
  - Shows parallel workflow in action
  - Consultation approaching end date (warning badge)
  - Assessment started Oct 8
- **Application 2 (PA-2025-002):** Still pending validation
  - All stages locked/not-started
  - Demonstrates dependency blocking
- **Application 3 (PA-2025-003):** All stages completed
  - Shows completed workflow state
  - Review stage marked complete

### Component Updates

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
- Replaced `ApplicationTimeline` with `ApplicationStageTimeline`
- Now passes full `application` object instead of individual date props
- Timeline integrated in left column (66%) with proposal description

### Workflow Logic

**Stage Dependencies:**
1. Application starts in Validation stage (pending/active)
2. Once validated, Consultation and Assessment unlock
3. Consultation and Assessment can run in parallel (both active simultaneously)
4. Review stage only unlocks when both Consultation AND Assessment are completed
5. Locked stages show dependency requirements inline

**Visual Design:**
- Vertical timeline with stage nodes and connecting lines
- Parallel branching shows Consultation + Assessment side-by-side
- Color-coded status system (grey/blue/green)
- Icons reinforce status at a glance
- Dates contextualized within each stage (not separate milestones)
- Clean, scannable hierarchy

**Technical Features:**
- Date formatting with UK locale (en-GB)
- Date proximity detection (7-day threshold for warnings)
- Conditional rendering based on validation status
- Parallel stage visualization with branching layout
- Status-driven styling system
- Type-safe props with full PlanningApplication interface
- Lucide React icons (Lock, Clock, CheckCircle)

### Components Removed

- **ApplicationTimeline** ([components/shared/application-timeline.tsx](components/shared/application-timeline.tsx))
  - Replaced by ApplicationStageTimeline
  - Old date-only timeline no longer needed

**Files Created:**
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx)

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)

**Status:** Integrated stage workflow timeline complete. Timeline now shows both process stages (Validation → Consultation/Assessment → Review) AND key dates in context. Parallel workflow visualization implemented for Consultation + Assessment stages. Dependency logic enforces validation requirement and review stage unlocking.

---

## 2025-10-18 | Interactive Stage Cards with Task Progress & CTAs

**Built by:** Forge (Builder)

### Complete Timeline Redesign with Interactive Cards

Transformed static stage timeline into dynamic, expandable stage cards with task tracking, progress indicators, and call-to-action buttons.

### New Schema Interfaces

**Stage Task System** ([lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts))
- **StageTask Interface:**
  - `id: string` - Unique task identifier
  - `title: string` - Task description
  - `completed: boolean` - Completion status
  - `completedDate?: string` - ISO date when completed

- **Stage Interfaces:**
  - **ValidationStage:** `status`, `validatedDate`, `tasks[]`
  - **ConsultationStage:** `status`, `startDate`, `endDate`, `tasks[]`
  - **AssessmentStage:** `status`, `startDate`, `completedDate`, `tasks[]`
  - **ReviewStage:** `status`, `startDate`, `completedDate`, `tasks[]`

- **PlanningApplication Updates:**
  - Added `validation: ValidationStage`
  - Added `consultation: ConsultationStage`
  - Added `assessment: AssessmentStage`
  - Added `review: ReviewStage`
  - Kept legacy fields for backward compatibility

### Mock Data with Realistic Tasks

**Application 1 (PA-2025-001)** - Active parallel workflow:
- **Validation:** 4/4 tasks complete (validated)
- **Consultation:** 3/5 tasks complete (in progress)
  - Statutory consultees notified ✓
  - Site notice posted ✓
  - Neighbours notified ✓
  - Review responses (pending)
  - Prepare summary (pending)
- **Assessment:** 2/5 tasks complete (in progress)
  - Planning policy reviewed ✓
  - Design assessed ✓
  - Neighbour impact (pending)
  - Conservation check (pending)
  - Recommendation report (pending)
- **Review:** 0/3 tasks (locked until consultation + assessment done)

**Application 2 (PA-2025-002)** - Validation in progress:
- **Validation:** 1/4 tasks complete (pending)
- All other stages locked

**Application 3 (PA-2025-003)** - Fully completed:
- All stages 100% complete with completion dates

### Component Overhaul

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))
- Complete rewrite with client-side interactivity (`'use client'`)
- **StageCard Sub-Component:**
  - Expandable/collapsible stage cards
  - Auto-expands active stages by default
  - Color-coded status states (grey/blue/green)
  - Icons: Lock (locked), Clock (active), CheckCircle (completed)
  - Progress bars for active stages
  - "Parallel" badge for Consultation + Assessment

**Stage States & Display:**

1. **Locked State:**
   - Grey muted styling
   - Lock icon
   - Message: "Cannot start until validation is complete" (or similar)
   - No expand/collapse functionality
   - Empty state UX

2. **Active State (In Progress):**
   - Blue highlighted container
   - Clock icon
   - Progress indicator: "3 of 5 tasks completed" with percentage
   - Animated progress bar showing completion percentage
   - Expandable to show task list
   - Checkmarks for completed tasks, empty circles for pending
   - CTA button at bottom: "Continue validation", "Continue consultation", etc.
   - Auto-expanded by default

3. **Completed State:**
   - Green highlighted container
   - CheckCircle icon
   - Completion date display: "Validated on: 6 October 2025"
   - Expandable to view all completed tasks
   - All tasks show green checkmarks

**Interactive Features:**
- Click-to-expand/collapse (ChevronUp/ChevronDown icons)
- Active stages start expanded
- Completed stages start collapsed
- Task lists with checkboxes (completed vs pending)
- Full-width CTA buttons for active stages
- Smooth transitions and hover states

**Dependency Logic:**
- Validation must complete before unlocking Consultation + Assessment
- Both Consultation AND Assessment must complete before unlocking Review
- Locked stages show clear dependency messages
- "Parallel" badge indicates stages that can run simultaneously

**Visual Design:**
- Card-based layout with colored borders and backgrounds
- Status-driven color system:
  - Locked: `bg-muted/30 border-muted`
  - Active: `bg-blue-50 border-blue-200` (dark: `bg-blue-950/20`)
  - Completed: `bg-green-50/50 border-green-200` (dark: `bg-green-950/20`)
- Progress bar with smooth width transitions
- Full dark mode support

**Technical Implementation:**
- React hooks: `useState` for expand/collapse state
- Percentage calculation for progress bars
- Dynamic styling based on status
- Accessible expand/collapse buttons with aria-labels
- Type-safe props with full TypeScript interfaces

### Files Created/Modified

**Created:**
- N/A (rewrote existing file)

**Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts) - Added task and stage interfaces
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts) - Added realistic task data for all 3 applications
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx) - Complete rewrite with interactive cards

### UX Improvements

**Actionable Workflow:**
- Timeline transformed from passive display to active workflow management
- Officers can see exactly what tasks remain at each stage
- Clear CTAs guide next actions
- Progress indicators show completion status at a glance

**Progressive Disclosure:**
- Collapsed view shows status summary
- Expanded view reveals detailed task lists
- Reduces cognitive load while maintaining access to details
- Auto-expand active stages for immediate context

**Status Communication:**
- Visual hierarchy immediately shows current stage
- Color coding reinforces status (grey=blocked, blue=active, green=done)
- Icons provide quick visual cues
- Percentage progress gives quantitative feedback

**Status:** Interactive stage workflow complete. Timeline now features expandable stage cards with task-level progress tracking, dynamic content based on status (locked/active/completed), progress bars, and call-to-action buttons. Officers can track individual tasks within each stage and understand dependencies at a glance.

---

## 2025-10-18 | Simplified Navigation-Focused Stage Cards

**Built by:** Forge (Builder)

### UX Refinement: From Expandable to Navigable

Simplified stage cards to focus on navigation rather than in-place expansion. Removed task list disclosure in favor of clean, clickable cards that link to dedicated stage pages.

### Component Updates

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))

**Removed:**
- Expandable/collapsible functionality (useState, ChevronUp/ChevronDown)
- In-card task lists with checkboxes
- CTA buttons within cards
- Client-side interactivity (`'use client'` directive removed)

**Added:**
- Next.js Link integration for navigation
- ChevronRight arrow indicator on clickable cards
- Hover states with border highlight (hover:border-primary/50)
- Placeholder routing: `/application/{id}/{stage-slug}`
  - `/application/1/validation`
  - `/application/1/consultation`
  - `/application/1/assessment`
  - `/application/1/review`

**Stage Card Behavior:**

1. **Locked Stages:**
   - Not clickable (no link wrapper)
   - Grey styling with lock icon
   - Empty state message
   - No chevron arrow

2. **Active Stages:**
   - Clickable card (Link wrapper)
   - Blue highlighted container
   - Clock icon + progress bar
   - Shows "X of Y tasks completed" with percentage
   - ChevronRight arrow on hover (color shifts to primary)
   - Links to stage detail page

3. **Completed Stages:**
   - Clickable card (still accessible)
   - Green highlighted container
   - CheckCircle icon + completion date
   - ChevronRight arrow
   - Links to stage detail page (can review completed work)

**Visual Design:**
- Clean, card-based layout without expansion complexity
- Hover state: border changes to primary color (50% opacity)
- Group hover effect on ChevronRight icon
- Maintains all status-based color coding (grey/blue/green)
- Progress bars for active stages remain visible at card level

**Navigation Pattern:**
- All unlocked stages are navigable (active + completed)
- Locked stages show why they're blocked but don't link
- Officers can revisit completed stages to review work
- Consistent UX: click card to enter stage detail view

**Technical Changes:**
- Removed React hooks (no client-side state)
- Added `applicationId` and `stageSlug` props to StageCard
- Conditional rendering: Link wrapper for clickable, div for locked
- Server component (no 'use client' directive)
- ChevronRight replaces expand/collapse icons

### Routing Structure (Placeholder)

Stage detail pages will be located at:
- `/app/application/[id]/validation/page.tsx`
- `/app/application/[id]/consultation/page.tsx`
- `/app/application/[id]/assessment/page.tsx`
- `/app/application/[id]/review/page.tsx`

These pages will display:
- Full task list with detailed information
- Task completion interface
- Stage-specific content and tools
- Navigation back to application overview

**Files Modified:**
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx)

**Status:** Stage cards simplified to navigation-focused design. Removed expandable task lists in favor of clean, clickable cards that link to dedicated stage pages. All unlocked stages (active + completed) are navigable with placeholder routing ready for implementation.

---

## 2025-10-18 | Minimalist Timeline Progress Indicator

**Built by:** Forge (Builder)

### Visual Timeline Enhancement

Added left-side progress indicator to Application Progress section, transforming stage cards into a visual timeline layout.

### Design Changes

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))

**Timeline Visual Components:**
- **Vertical Line:** Thin (0.5px width) connecting line running through all stages
- **Circle Nodes:** Small (10px diameter) circular indicators at each stage
- **Minimalist Color System:**
  - Locked stages: Light grey line + empty circle outline
  - Active/Completed stages: Primary blue line + filled blue circle
  - No color variation between active and completed (single accent color)

**Layout Structure:**
- Left column: Timeline elements (40px width)
  - Vertical connecting line
  - Circle node positioned at top of each card (mt-6 for alignment)
- Right column: Stage cards (full width, flex-1)
- 4-unit gap between timeline and cards

**Simplified Status Indicators:**
- Removed CheckCircle icon from completed stages
- Active and completed stages now share same styling (Clock icon, blue accent)
- Timeline nodes are purely visual (no icons inside circles)
- Minimalist approach with single accent color (GDS blue)

**Technical Implementation:**
- Timeline wrapper function wraps all card content
- Vertical line uses `flex-1` to span between nodes
- Last stage node has no line below it (`isLast` prop)
- Circle nodes use 2px border, either filled or outlined
- Color-coded with `bg-primary` (filled) or `bg-transparent` (outlined)
- Full dark mode compatibility maintained

**Color Consolidation:**
- Removed green color for completed stages
- Unified active/completed styling with blue accent
- Grey for locked, blue for everything else
- Cleaner, more professional appearance

**Visual Design Principles:**
- Minimalist aesthetic - no decorative elements
- Single accent color for clarity
- Subtle timeline elements that don't overwhelm cards
- Professional, government-appropriate design
- Clean spatial hierarchy

**Files Modified:**
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx)

**Status:** Minimalist timeline progress indicator complete. Application Progress section now displays with vertical timeline on left (connecting line + circle nodes) and stage cards on right. Single-color accent system (blue for active/completed, grey for locked) provides clean, professional visual progression.

---

## 2025-10-18 | Flat Timeline Layout with Contextual Actions

**Built by:** Forge (Builder)

### Design Refinement - From Cards to Flat List

Transformed stage timeline from card-based layout to flat, Airbnb-style list with bottom borders and contextual action buttons.

### Major Changes

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))

**Removed Card Styling:**
- Eliminated clickable card behavior (entire stage was previously a Link)
- Removed card backgrounds, borders, and rounded corners
- Removed hover states on card containers
- Removed ChevronRight navigation arrows
- Simplified to flat content layout with bottom border separators

**New Border System:**
- Simple bottom border (`border-b border-border`) between stages
- Padding bottom/top (6 units) for breathing room
- Last stage has no bottom border (`last:border-b-0`)
- Clean, list-based separation instead of card containers

**Contextual Action Buttons/Links:**

1. **Locked Stages:**
   - No action button/link (cannot interact)
   - Shows dependency message only

2. **Active Stages:**
   - Blue primary button (not full width)
   - Stage-specific action text:
     - Validation: "Check validation"
     - Consultation: "Review consultation"
     - Assessment: "Check and assess"
     - Review: "Review and approve"
   - Links to stage detail page

3. **Completed Stages:**
   - Text link (blue primary color)
   - Format: "View or change {stage name}"
   - Hover transitions to foreground color
   - Links to stage detail page

**Layout Structure:**
- Timeline column (40px) with vertical line + circle node
- Content column (flex-1) with flat content layout
- No wrapper containers or card styling
- Content flows naturally with typography hierarchy
- Action buttons/links positioned below stage information

**Visual Hierarchy:**
- Stage title with icon (Lock/Clock) at top
- Progress bar or completion date in middle
- Action button/link at bottom (if applicable)
- Clean vertical stacking with consistent spacing

**Technical Changes:**
- Removed `isClickable` logic and conditional Link wrappers
- Simplified component structure - single return statement
- Action buttons rendered inline within content flow
- Border separators applied to timeline wrapper div
- Circle node alignment adjusted (mt-1.5) for better visual balance

**Design Philosophy:**
- Flat, content-first Airbnb aesthetic
- Actions are explicit, not implicit (no whole-card clickability)
- Clear call-to-action buttons for active stages
- Subtle links for completed stages (review/edit capability)
- Minimalist separator system instead of heavy card UI

**Spacing & Typography:**
- 6-unit padding bottom/margin bottom between stages
- Consistent 3-unit margin bottom on info elements
- Action buttons use standard padding (px-4 py-2)
- Text links inline with natural flow

**Files Modified:**
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx)

**Status:** Flat timeline layout complete. Removed card styling in favor of clean list with bottom borders. Added contextual action buttons for active stages ("Check and assess") and text links for completed stages ("View or change validation"). No clickable card behavior - actions are explicit and purposeful.

---

## 2025-10-18 | Overview Section - Requested Services

**Built by:** Forge (Builder)

### Components Created

**RequestedServices** ([components/shared/requested-services.tsx](components/shared/requested-services.tsx))
- Displays requested services as inline badges
- Three service types supported:
  - Written advice
  - Site visit
  - Meeting
- Clean badge layout with muted background
- Horizontal flex layout with gap spacing
- Conditional rendering (only shows if services exist)
- Full dark mode compatibility

### Schema Updates

**PlanningApplication Interface** ([lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts))
- Added `RequestedService` type: `'written-advice' | 'site-visit' | 'meeting'`
- Added `requestedServices?: RequestedService[]` field to PlanningApplication

### Mock Data Updates

**Applications Data** ([lib/mock-data/applications.ts](lib/mock-data/applications.ts))
- Application 1 (PA-2025-001): Added all three requested services (written-advice, site-visit, meeting)

### Component Updates

**ProposalDescription** ([components/shared/proposal-description.tsx](components/shared/proposal-description.tsx))
- Renamed heading from "Proposal" to "Proposal description"

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
- Integrated RequestedServices component below Proposal description
- Added `space-y-6` to left column for consistent vertical spacing
- Conditional rendering based on `requestedServices` field

### Visual Design

- Badge styling: Muted background (`bg-muted`), rounded-sm corners
- Inline layout with flex-wrap for responsive stacking
- 2-unit gap between service badges
- Text size: base (consistent with proposal description)
- Clean, minimal presentation matching Airbnb-style flat design

**Files Created:**
- [components/shared/requested-services.tsx](components/shared/requested-services.tsx)

**Files Modified:**
- [lib/mock-data/schemas/index.ts](lib/mock-data/schemas/index.ts)
- [lib/mock-data/applications.ts](lib/mock-data/applications.ts)
- [components/shared/proposal-description.tsx](components/shared/proposal-description.tsx)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)

**Status:** Overview section enhanced with "Requested services" display. Shows three service types (Written advice, Site visit, Meeting) as inline badges below proposal description. Clean, flat design consistent with existing UX patterns.

---

## 2025-10-18 | Border Radius Consistency - Sharp Corners

**Built by:** Forge (Builder)

### Visual Refinement

Removed all border radius (rounded corners) from labels, badges, and containers across the application to maintain consistent sharp corner styling.

**Components Updated:**

1. **RequestedServices** ([components/shared/requested-services.tsx](components/shared/requested-services.tsx))
   - Service badges: Removed `rounded-sm`, now sharp corners

2. **ApplicationMetadata** ([components/shared/application-metadata.tsx](components/shared/application-metadata.tsx))
   - Public portal badge: Removed `rounded`
   - Application type badge: Removed `rounded`

3. **ApplicationTimeline** ([components/shared/application-timeline.tsx](components/shared/application-timeline.tsx))
   - Status badges (Active/Approaching): Removed `rounded`

4. **ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
   - Placeholder boxes: Removed `rounded` from all dashed border placeholders

5. **ApplicationDetailLayout** ([components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx))
   - Map placeholder: Removed `rounded-lg`

6. **ThemeToggle** ([components/shared/theme-toggle.tsx](components/shared/theme-toggle.tsx))
   - Toggle button: Removed `rounded-md`

**What Remains Rounded:**
- Timeline circle nodes (`rounded-full`) - intentional design element for timeline visualization
- UI components (avatar, dropdown menus, etc.) - Shadcn defaults maintained for interactive elements

**Visual Consistency:**
- All labels and badges now have sharp corners
- Consistent with rectangular badge design established earlier
- Clean, professional government-appropriate aesthetic
- Placeholders and content containers maintain sharp edges

**Files Modified:**
- [components/shared/requested-services.tsx](components/shared/requested-services.tsx)
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)
- [components/shared/application-timeline.tsx](components/shared/application-timeline.tsx)
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)
- [components/shared/application-detail-layout.tsx](components/shared/application-detail-layout.tsx)
- [components/shared/theme-toggle.tsx](components/shared/theme-toggle.tsx)

**Status:** Border radius removed from all labels, badges, and containers. Application now maintains consistent sharp corner styling throughout, with rounded corners only on intentional circular elements (timeline nodes) and base UI components.

---

## 2025-10-18 | Dark Mode - Status Badge Optimization

**Built by:** Forge (Builder)

### Issue Resolved

Status labels in Application Details hero section were not optimized for dark mode - using hardcoded light colors that didn't adapt to theme changes.

### Fix Applied

**ApplicationStatusBadges** ([components/shared/application-status-badges.tsx](components/shared/application-status-badges.tsx))
- Added dark mode variants to status badge (blue):
  - Light mode: `bg-blue-100 text-blue-800`
  - Dark mode: `dark:bg-blue-900 dark:text-blue-100`
- Added dark mode variants to days countdown badge (yellow):
  - Light mode: `bg-yellow-100 text-yellow-800`
  - Dark mode: `dark:bg-yellow-900 dark:text-yellow-100`

### Visual Result

- Status badges now have proper contrast in both light and dark modes
- Blue status badge: Light background in light mode, dark background in dark mode
- Yellow countdown badge: Light background in light mode, dark background in dark mode
- Text colors inverted appropriately for readability

**Files Modified:**
- [components/shared/application-status-badges.tsx](components/shared/application-status-badges.tsx)

**Status:** Status badges fully optimized for dark mode with proper color variants.

---

## 2025-10-18 | Unified Badge Component System

**Built by:** Forge (Builder)

### Problem Identified

Badge/label styling was inconsistent across the application with multiple inline implementations:
- **Inconsistent padding**: Three different combinations (`px-3 py-1`, `px-2 py-0.5`, `px-3 py-1.5`)
- **Inconsistent text sizes**: `text-base`, `text-sm`, mixed usage
- **Border radius inconsistency**: RequestedServices still had `rounded-sm` (missed in earlier cleanup)
- **No reusability**: Each component had inline badge styling
- **Mixed color approaches**: Hardcoded colors vs semantic tokens

### Solution Implemented

Created a unified Badge component system with consistent variants.

**Badge Component** ([components/ui/badge.tsx](components/ui/badge.tsx))
- Replaced Shadcn default badge variants with custom application-specific variants
- **Size variants:**
  - `default`: `text-base px-3 py-1` - for hero badges and requested services
  - `small`: `text-sm px-2 py-0.5` - for sidebar metadata badges
- **Color variants:**
  - `blue`: Blue background with dark mode support
  - `yellow`: Yellow background with dark mode support
  - `green`: Green background with dark mode support
  - `gray`: Gray background with dark mode support
  - `muted`: Semantic muted background (uses theme tokens)
- **No border radius** - sharp corners throughout (removed `rounded-full` from Shadcn defaults)
- **Full dark mode support** for all color schemes
- Uses class-variance-authority (CVA) for type-safe variants

### Components Refactored

**ApplicationStatusBadges** ([components/shared/application-status-badges.tsx](components/shared/application-status-badges.tsx))
- Removed inline badge styling
- Now uses `<Badge variant="blue" size={badgeSize}>` for status
- Now uses `<Badge variant="yellow" size={badgeSize}>` for days countdown
- Maps `compact` prop to `small` badge size
- Cleaner, more maintainable code

**ApplicationMetadata** ([components/shared/application-metadata.tsx](components/shared/application-metadata.tsx))
- Removed inline badge styling
- Public portal: `<Badge variant={isPublic ? 'green' : 'gray'} size="small">`
- Application type: `<Badge variant="blue" size="small">`
- Conditional color based on public status (green for Yes, gray for No)

**RequestedServices** ([components/shared/requested-services.tsx](components/shared/requested-services.tsx))
- Removed inline badge styling and `rounded-sm` border radius
- Now uses `<Badge variant="muted">` for all service badges
- Uses semantic muted variant for neutral appearance
- Consistent with flat Airbnb-style design

### Benefits

- **Consistency**: All badges now use same component with standardized sizing and spacing
- **Maintainability**: Single source of truth for badge styling
- **Type safety**: CVA provides compile-time type checking for variants
- **Dark mode**: All badges properly support both light and dark themes
- **Sharp corners**: Complete removal of border radius as per design system
- **Reusability**: Badge component can be used anywhere in the application
- **Clean code**: No more inline styling or className strings

### Visual Result

All labels across the application now have:
- Consistent padding (default: 12px/4px, small: 8px/2px)
- Consistent text sizing (default: base, small: sm)
- No border radius (sharp corners)
- Proper dark mode colors
- Unified component API

**Files Created:**
- N/A (modified existing Shadcn badge component)

**Files Modified:**
- [components/ui/badge.tsx](components/ui/badge.tsx)
- [components/shared/application-status-badges.tsx](components/shared/application-status-badges.tsx)
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)
- [components/shared/requested-services.tsx](components/shared/requested-services.tsx)

**Status:** Badge component system unified. All labels and badges across the application now use a single, consistent Badge component with size and color variants. Sharp corners enforced, dark mode fully supported.

---

## 2025-10-18 | Section Spacing Consistency

**Built by:** Forge (Builder)

### Issue Identified

Section spacing was inconsistent between the Overview section and other sections (Application Progress, Documents, Assessment, History, Comments).

**Inconsistency:**
- Overview section: No top padding (started flush with content area)
- All other sections: `pt-8` top padding for consistent breathing room between sections

### Fix Applied

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))
- Added `pt-8` top padding to Overview section container
- Now matches the spacing pattern used by Application Progress section and all subsequent sections

### Visual Result

All sections now have consistent vertical spacing:
- Each section has `pt-8 pb-8` (top and bottom padding of 8 units = 40px)
- Horizontal separators between sections
- Uniform breathing room above and below each section
- Clean, balanced visual rhythm throughout the page

**Files Modified:**
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)

**Status:** Section spacing now consistent throughout Application Details page. All sections use `pt-8 pb-8` pattern.

---

## 2025-10-18 | Timeline Content-to-Divider Spacing Fix

**Built by:** Forge (Builder)

### Issue Identified

Spacing between timeline content and the horizontal divider was inconsistent:
- Timeline stages (Validation, Consultation, Assessment, Review): Each had `pb-8` (32px bottom padding)
- Expiry Date item: Had no bottom padding, only the section's `space-y-4` (16px)
- Result: Very tight spacing (16px) between "Expires 30 October 2025" and the divider below
- Other sections (Documents, etc.): Proper spacing (48px = 32px from content + 16px from space-y-4)

### Fix Applied

**ApplicationStageTimeline** ([components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx))
- Added `pb-8` to Expiry Date content container (line 253)
- Now matches the bottom padding pattern of all other timeline stages

### Visual Result

Consistent spacing throughout the page:
- All timeline items now have `pb-8` bottom padding
- Combined with section's `space-y-4`, creates uniform spacing above dividers
- Total spacing: 48px (32px content padding + 16px space-y gap)
- Matches the spacing pattern used by Documents section and all other sections

**Files Modified:**
- [components/shared/application-stage-timeline.tsx](components/shared/application-stage-timeline.tsx)

**Status:** Timeline content-to-divider spacing fixed. All sections now have consistent spacing between content and horizontal dividers.

---

## 2025-10-18 | Section Divider Spacing Restructure

**Built by:** Forge (Builder)

### Issue Identified

Spacing around horizontal dividers was inconsistent throughout the page:
- Dividers were **inside** sections, wrapped by section padding
- This created uneven spacing: less space above divider, more space below
- Combined with `space-y-4` on sections, the math was: Content → 16px → HR → 32px (pb-8) + 32px (next pt-8) = 64px
- Result: Dividers appeared closer to content above than content below

**User Feedback:**
"Above and below the section divider should have the same spacing"

### Solution Implemented

Restructured all sections to place dividers **between** sections rather than inside them.

**ApplicationSections** ([components/shared/application-sections.tsx](components/shared/application-sections.tsx))

**Changes Made:**
1. Moved all `<hr>` elements **outside** section containers
2. Removed `space-y-4` from all sections (was causing inconsistent gaps)
3. Added explicit `mb-4` to section headings (h2 elements) for spacing between title and content
4. Kept `pt-8 pb-8` on all sections for consistent vertical rhythm

**New Structure:**
```jsx
<section className="pt-8 pb-8">
  <h2 className="mb-4">Title</h2>
  <div>Content</div>
</section>

<hr />  ← Divider is BETWEEN sections, not inside

<section className="pt-8 pb-8">
  ...
</section>
```

### Spacing Math

**Consistent spacing around dividers:**
- Content end → Section `pb-8` (32px) → **HR** → Next section `pt-8` (32px) → Next content start
- **Result**: 32px above divider, 32px below divider ✓
- Perfect symmetry around all horizontal dividers

**Within sections:**
- Section heading → `mb-4` (16px) → Content
- Consistent internal spacing

### Visual Result

All sections now have:
- **Equal spacing above and below dividers** (32px each side)
- **Consistent section padding** (`pt-8 pb-8` on all sections)
- **Clean heading spacing** (`mb-4` between h2 and content)
- **Uniform visual rhythm** throughout the page
- **No unexpected gaps** or tight spacing

### Sections Updated

All sections restructured with consistent pattern:
- Overview (two-column layout)
- Application Progress (timeline)
- Documents
- Assessment
- History
- Comments

**Files Modified:**
- [components/shared/application-sections.tsx](components/shared/application-sections.tsx)

**Status:** Section divider spacing fully restructured. All horizontal dividers now have equal spacing (32px) above and below. Consistent vertical rhythm established throughout Application Details page.

---

## 2025-10-18 | Metadata Badge Color Update

**Built by:** Forge (Builder)

### Change Requested

Updated metadata sidebar badge colors to use grey variant for a more neutral, subdued appearance.

### Changes Applied

**ApplicationMetadata** ([components/shared/application-metadata.tsx](components/shared/application-metadata.tsx))
- Changed Public Portal badge from conditional `green/gray` to always `gray`
  - Was: `variant={isPublic ? 'green' : 'gray'}`
  - Now: `variant="gray"`
- Changed Application Type badge from `blue` to `gray`
  - Was: `variant="blue"`
  - Now: `variant="gray"`

### Visual Result

Both metadata badges now use neutral grey styling:
- **"No"** (Public on BOPS Public Portal): Grey badge
- **"Pre-application Advice"** (Application type): Grey badge

This creates a more subdued, consistent appearance in the metadata sidebar, allowing the hero badges (blue status, yellow countdown) to be the primary visual indicators.

**Files Modified:**
- [components/shared/application-metadata.tsx](components/shared/application-metadata.tsx)

**Status:** Metadata badges updated to grey variant for neutral styling.

---

## 2025-10-18 | Badge Color Consistency - All Grey

**Built by:** Forge (Builder)

### Issue Identified

Badge colors were inconsistent across the page:
- **RequestedServices** ("Written advice", "Site visit", "Meeting"): Used `variant="muted"` → `bg-muted text-foreground`
- **ApplicationMetadata** ("No", "Pre-application Advice"): Used `variant="gray"` → `bg-gray-100 text-gray-800`

These two variants rendered with different colors and would not match visually.

### Fix Applied

**RequestedServices** ([components/shared/requested-services.tsx](components/shared/requested-services.tsx))
- Changed from `variant="muted"` to `variant="gray"`
- Now matches the metadata badges exactly

### Visual Result

All informational badges now use the same grey styling:
- **"Written advice"** → Grey badge
- **"Site visit"** → Grey badge
- **"Meeting"** → Grey badge
- **"No"** (Public Portal) → Grey badge
- **"Pre-application Advice"** (Application type) → Grey badge

**Consistent styling:**
- Light mode: `bg-gray-100 text-gray-800`
- Dark mode: `bg-gray-800 text-gray-300`
- All badges have identical appearance and behavior

**Color hierarchy:**
- **Hero badges** (status/countdown): Blue and yellow for high visibility
- **Informational badges** (services/metadata): Grey for subdued, neutral presentation

**Files Modified:**
- [components/shared/requested-services.tsx](components/shared/requested-services.tsx)

**Status:** All informational badges now use consistent grey variant. Perfect visual consistency across "Written advice", "No", and "Pre-application Advice" badges.

---

## 2025-10-18 | Site Header Border - Slightly Brighter in Dark Mode

**Built by:** Forge (Builder)

### Issue Identified

The site header's 10px blue border was too prominent in dark mode, appearing overly bright and harsh against the dark background.

### Fix Applied

**SiteHeader** ([components/shared/site-header.tsx](components/shared/site-header.tsx))
- Added dark mode variant: `dark:border-b-[hsl(211,66%,50%)]`
- Keeps the same GDS blue hue and saturation (211°, 66%)
- Slightly increased lightness from 41% to 50% (9% brighter)
- Light mode remains unchanged (GDS primary blue at 41% lightness)

### Color Specification

**Light mode:**
- Border: `hsl(211, 66%, 41%)` - GDS blue (`#1d70b8`)

**Dark mode:**
- Border: `hsl(211, 66%, 50%)` - Same blue, slightly brighter
- Maintains exact same hue and saturation
- Only lightness adjusted upward for better visibility
- Subtle brightness increase provides better contrast without harshness

### Visual Result

The border maintains the same GDS blue color identity but with a gentle brightness boost for dark mode. This provides better visibility and reduces harshness while keeping color consistency across themes.

**Files Modified:**
- [components/shared/site-header.tsx](components/shared/site-header.tsx)

**Status:** Site header border updated to use same GDS blue with 9% increased lightness in dark mode.

---
