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
