# Changes & Fixes Log

Track all bug fixes and modifications.

## Format
**Date** | **Issue** | **Resolution** | **Files Changed**

---

## 2025-10-17 | React Server Components Bundler Error

**Issue:** Next.js 15.5.6 throwing "Could not find the module in the React Client Manifest" error after adding client components

**Resolution:** Cleared Next.js cache (.next directory) and restarted dev server. This is a known issue with Next.js 15 when adding new client components that can be resolved by clearing the build cache.

**Files Changed:** None (cache clear only)

**Status:** ✅ Resolved - Dev server running successfully on http://localhost:3006

---

## 2025-10-19 | Assessment Layout Dimension Optimization

**Issue:** Assessment page layout needed optimization for 1440px screens with proper spacing and content width constraints

**Resolution:**
- Increased TaskPanel width from 288px to 338px (370px total with padding) for better task list readability
- Changed main content area to use flex-1 with centered 1100px max-width content
- Reduced main content horizontal padding from 20px (px-5) to 16px (px-4) for consistency with spacing scale
- Removed duplicate horizontal padding from AssessmentContent component (changed p-8 to py-8)

**Files Changed:**
- [task-panel.tsx](components/shared/task-panel.tsx) - Width: w-[288px] → w-[338px]
- [assessment-layout.tsx](components/shared/assessment-layout.tsx) - Main content: flex-1 with max-w-[1100px] px-4
- [assessment-content.tsx](components/shared/assessment-content.tsx) - Padding: p-8 → py-8
- [build-log.md](docs/rapid-prototype/build-log.md) - Updated layout documentation

**Status:** ✅ Resolved - Clean responsive layout with TaskPanel at 370px, content constrained to 1100px max-width

---

## 2025-10-19 | Application Information Link Not Working

**Issue:** "Application information" link in CaseSummaryHeader was using `href="#"` placeholder, not navigating to the application information page

**Resolution:**
- Added `applicationId` prop to CaseSummaryHeader component
- Updated link to use Next.js Link component with proper route `/application/${applicationId}/information`
- Added `target="_blank"` and `rel="noopener noreferrer"` to open page in new tab
- Updated AssessmentLayout to pass applicationId prop to CaseSummaryHeader

**Files Changed:**
- [case-summary-header.tsx](components/shared/case-summary-header.tsx) - Added applicationId prop, replaced <a> with Link, added target="_blank"
- [assessment-layout.tsx](components/shared/assessment-layout.tsx) - Pass applicationId to CaseSummaryHeader

**Status:** ✅ Resolved - Application information link now navigates to `/application/[id]/information` in new tab

---

## 2025-10-19 | Application Information Page Title Size Update

**Issue:** Tab section titles on Application Information page were using text-xl instead of text-2xl for visual hierarchy

**Resolution:**
- Updated all 6 tab section component titles from text-xl to text-2xl
- Maintains consistency with larger page titles across the application

**Files Changed:**
- [application-info-overview.tsx](components/shared/application-info-overview.tsx) - Title: text-xl → text-2xl
- [application-info-documents.tsx](components/shared/application-info-documents.tsx) - Title: text-xl → text-2xl
- [application-info-constraints.tsx](components/shared/application-info-constraints.tsx) - Title: text-xl → text-2xl
- [application-info-site-history.tsx](components/shared/application-info-site-history.tsx) - Title: text-xl → text-2xl
- [application-info-consultees.tsx](components/shared/application-info-consultees.tsx) - Title: text-xl → text-2xl
- [application-info-neighbours.tsx](components/shared/application-info-neighbours.tsx) - Title: text-xl → text-2xl

**Status:** ✅ Resolved - All Application Information page section titles now use text-2xl

---

## 2025-10-19 | DocumentsTable Cell Padding Alignment

**Issue:** Table content needed to align with vertical cell borders while maintaining 20px total spacing between columns

**Resolution:**
- First column (thumbnail): `pl-0 pr-2.5` - aligns left edge with border, 10px spacing to next column
- Middle columns: `px-2.5` - 10px padding each side (10px + 10px = 20px total spacing between columns)
- Last column (visibility): `pl-2.5 pr-0` - 10px spacing from previous, aligns right edge with border
- Vertical padding maintained at `py-4` for row spacing
- Uses Tailwind `px-2.5` (10px each side) to achieve 20px total gap between adjacent columns

**Files Changed:**
- [documents-table.tsx](components/shared/documents-table.tsx) - Updated TableHead and TableCell padding to px-2.5 (10px per side = 20px total between columns)

**Status:** ✅ Resolved - Table content aligns with borders and has 20px total spacing between columns

---

## 2025-10-19 | Table Border Color Update

**Issue:** Table borders needed to use grey color (`border-border`) instead of default border color

**Resolution:**
- Added explicit `border-border` class to TableHeader, TableRow, and TableFooter components
- Ensures consistent grey border color across all table instances

**Files Changed:**
- [table.tsx](components/ui/table.tsx) - Added `border-border` class to TableHeader, TableRow, and TableFooter

**Status:** ✅ Resolved - Table borders now use grey color from design system

---

## 2025-10-19 | DocumentsTable Thumbnail Integration

**Issue:** Separate thumbnail column had empty header, felt disconnected from document information

**Resolution:**
- Merged thumbnail column into "Document name" column
- Reduced from 5 columns to 4 columns total
- Used flexbox layout: thumbnail (64px) on left, document name and tags on right
- Added `gap-2.5` (10px) spacing between thumbnail and content
- `items-start` alignment keeps thumbnail aligned with first line of text
- Maintains same padding structure: first column `pl-0 pr-2.5`, last column `pl-2.5 pr-0`

**Files Changed:**
- [documents-table.tsx](components/shared/documents-table.tsx) - Merged thumbnail into Document name column with flex layout

**Status:** ✅ Resolved - Thumbnail integrated with document name, cleaner table header

---

## 2025-10-20 | Badge Component Consistency Across Application Information Page

**Issue:** Position badges in Application Information page sections (Consultees and Neighbours) were using custom inline implementations with `rounded-md` corners instead of the shared Badge component which has no border radius

**Resolution:**
- Added red variant to Badge component for objection/object positions
- Replaced custom inline badge implementations in ApplicationInfoConsultees with Badge component
- Replaced custom inline badge implementations in ApplicationInfoNeighbours with Badge component
- Updated topic tags in neighbours to use Badge component instead of custom spans
- All badges now consistently use no border radius (sharp corners) per GDS design system
- Position badges use small size with appropriate color variants (green/red/yellow/gray/blue)

**Files Changed:**
- [badge.tsx](components/ui/badge.tsx) - Added red variant
- [application-info-consultees.tsx](components/shared/application-info-consultees.tsx) - Replaced PositionBadge inline implementation with Badge component
- [application-info-neighbours.tsx](components/shared/application-info-neighbours.tsx) - Replaced PositionBadge and topic tag inline implementations with Badge component
- [build-log.md](docs/rapid-prototype/build-log.md) - Updated Badge documentation to include red variant and usage notes

**Status:** ✅ Resolved - All badges across Application Information page now use shared Badge component with consistent styling (no border radius)

---

## 2025-10-20 | Vercel Deployment 500 Error Fix

**Issue:** Application deployed to Vercel was throwing `INTERNAL_FUNCTION_INVOCATION_FAILED` 500 error on dynamic routes. The Start button on the home page wasn't working, and navigating to `/application/1` resulted in internal server errors.

**Root Cause:** Next.js 15's async params API in dynamic routes was not generating static paths during build time, causing runtime failures in Vercel's serverless environment.

**Resolution:**
- Added `generateStaticParams()` function to all three dynamic route pages
- This function pre-generates all valid application IDs at build time
- Next.js now statically generates pages for all mock applications during the build process
- Changed from dynamic Server-Side Rendering (SSR) to Static Site Generation (SSG) for better performance and reliability

**Files Changed:**
- [app/application/[id]/page.tsx](app/application/[id]/page.tsx) - Added generateStaticParams
- [app/application/[id]/assessment/page.tsx](app/application/[id]/assessment/page.tsx) - Added generateStaticParams, imported mockApplications
- [app/application/[id]/information/page.tsx](app/application/[id]/information/page.tsx) - Added generateStaticParams

**Build Output:**
```
● /application/[id]                    (SSG - prerendered for: /1, /2, /3)
● /application/[id]/assessment         (SSG - prerendered for: /1, /2, /3)
● /application/[id]/information        (SSG - prerendered for: /1, /2, /3)
```

**Status:** ✅ Resolved - All pages now build successfully with static generation. Should deploy correctly to Vercel.

---

## 2025-10-21 | Leaflet Map SSR Build Error Fix

**Issue:** Build failing on Vercel (future-development branch) with `ReferenceError: window is not defined` during static page generation for `/application/[id]/information`. The error occurred during pre-rendering when Leaflet's client-side code (specifically the icon configuration on lines 10-15 of map-view.tsx) was executed during server-side rendering.

**Root Cause:** The MapView component imports Leaflet and manipulates `L.Icon.Default.prototype` at the module level. This code runs during SSR when Next.js pre-renders pages, but Leaflet is a browser-only library that requires the `window` object.

**Resolution:**
- Wrapped the MapView component import with Next.js `dynamic()` function with `ssr: false` option
- This prevents the MapView component from being rendered during server-side generation
- Added a loading state placeholder that displays "Loading map..." while the map component hydrates on the client
- The map now only loads in the browser after the page has hydrated

**Files Changed:**
- [application-info-constraints.tsx](components/shared/application-info-constraints.tsx) - Changed MapView import to use dynamic() with ssr: false

**Technical Details:**
```typescript
// Before: Direct import (causes SSR error)
import { MapView } from './map-view'

// After: Dynamic import with SSR disabled
const MapView = dynamic(() => import('./map-view').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
})
```

**Build Output:**
```
✓ Generating static pages (13/13)
● /application/[id]/information        (SSG - prerendered for: /1, /2, /3)
```

**Status:** ✅ Resolved - Build succeeds locally, static pages generated successfully. Ready for Vercel deployment.

---

## 2025-10-24 | TypeScript Build Errors with Future Task Panel

**Issue:** Build failing with two TypeScript errors:
1. `Property 'contentScrollRef' does not exist on type 'AssessmentContextType | FutureAssessmentContextType'` in assessment-layout.tsx
2. `Type '"light-blue"' is not assignable to type '"blue" | "yellow" | "green" | "red" | "gray" | "black" | "muted"'` in future-assessment-content.tsx

**Root Cause:**
1. The `contentScrollRef` property only exists in `FutureAssessmentContextType` but not in `AssessmentContextType`, but the code was trying to destructure it unconditionally from both contexts
2. The Badge component doesn't support a `"light-blue"` variant, only `"blue"`

**Resolution:**
1. Changed destructuring in assessment-layout.tsx to conditionally extract `contentScrollRef` only when using the future version:
   - Destructure `selectedTaskId` and `setSelectedTaskId` from the active context
   - Conditionally get `contentScrollRef` only from futureContext when TASK_PANEL_VERSION === 'future'
2. Changed Badge variant from `"light-blue"` to `"blue"` in future-assessment-content.tsx

**Files Changed:**
- [assessment-layout.tsx](components/shared/assessment-layout.tsx) - Conditional contentScrollRef extraction
- [future-assessment-content.tsx](components/shared/future-assessment-content.tsx) - Changed badge variant from "light-blue" to "blue"

**Technical Details:**
```typescript
// Before: Unconditional destructuring (causes error)
const { selectedTaskId, setSelectedTaskId, contentScrollRef } =
  (TASK_PANEL_VERSION === 'future' ? futureContext : currentContext)!

// After: Conditional extraction
const activeContext = TASK_PANEL_VERSION === 'future' ? futureContext : currentContext
const { selectedTaskId, setSelectedTaskId } = activeContext!
const contentScrollRef = TASK_PANEL_VERSION === 'future' ? futureContext!.contentScrollRef : undefined
```

**Build Output:**
```
✓ Compiled successfully
✓ Generating static pages (13/13)
```

**Status:** ✅ Resolved - Build passes successfully, all TypeScript errors fixed.

---

## 2025-10-30 | TypeScript Build Errors with Constraint Color and Geometry

**Issue:** Vercel build failing with two TypeScript errors:
1. `Property 'color' does not exist on type 'Constraint'` in application-info-constraints.tsx:89
2. `Object is possibly 'undefined'` in map-view.tsx:70 when accessing polygon coordinates

**Root Cause:**
1. TypeScript strict mode not recognizing the optional `color` property on `Constraint` type during build
2. TypeScript's type narrowing not working properly with discriminated union types for GeoJSON geometry coordinates

**Resolution:**
1. Added type assertion with nullish coalescing operator in application-info-constraints.tsx:
   - Changed `constraint.color || '#4A90E2'` to `(constraint.color ?? '#4A90E2') as string`
2. Added optional chaining with fallback in map-view.tsx for both Polygon and MultiPolygon geometry:
   - Changed `constraint.geometry.coordinates[0].map(...)` to `constraint.geometry.coordinates[0]?.map(...) ?? []`
   - Applied to both Polygon (line 70) and MultiPolygon (line 98) cases

**Files Changed:**
- [application-info-constraints.tsx](components/shared/application-info-constraints.tsx) - Added type assertion for constraint color
- [map-view.tsx](components/shared/map-view.tsx) - Added optional chaining with fallback for geometry coordinates

**Technical Details:**
```typescript
// Fix 1: Color property type assertion
style={{
  backgroundColor: (constraint.color ?? '#4A90E2') as string,
}}

// Fix 2: Optional chaining for geometry coordinates
const positions = constraint.geometry.coordinates[0]?.map(
  ([lng, lat]) => [lat, lng] as [number, number]
) ?? []
```

**Build Output:**
```
✓ Compiled successfully
✓ Generating static pages (10/10)
Route (app)                                 Size  First Load JS
├ ● /application/[id]                    4.81 kB         122 kB
├ ● /application/[id]/information        33.4 kB         150 kB
```

**Status:** ✅ Resolved - Build passes successfully, all TypeScript errors fixed. Ready for Vercel deployment.

---
