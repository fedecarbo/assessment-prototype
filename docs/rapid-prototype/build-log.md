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
