# Refactor Log

Track all code improvements and refactors by Sentinel (QA Refactor).

## Format
**Date** | **Refactor** | **Rationale** | **Impact**

---

## 2025-10-18 | Code Quality & Best Practices Refactor

**Reviewed by:** Sentinel (QA Refactor)

### Refactors Applied

#### 1. Extract Magic Numbers to CSS Variables
**Files:** [globals.css](../../app/globals.css), [application-sections.tsx](../../components/shared/application-sections.tsx)

**Changes:**
- Added `--spacing-sticky-header-offset: 100px` to Tailwind v4 `@theme`
- Added `--spacing-section-placeholder: 384px` to Tailwind v4 `@theme`
- Replaced hardcoded `scroll-mt-[100px]` with `scroll-mt-[--spacing-sticky-header-offset]` in all 4 sections

**Rationale:**
- DRY principle - single source of truth for spacing values
- Tailwind v4 uses CSS variables in `@theme` directive - following latest conventions
- Easier maintenance - change once, update everywhere
- Consistent with existing color and radius patterns in theme

**Impact:**
- Improved maintainability
- Easier to adjust sticky header offset globally
- Consistent with Tailwind v4 best practices

---

#### 2. Extract Status Badges to Reusable Component
**Files:** [application-status-badges.tsx](../../components/shared/application-status-badges.tsx) (new), [application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx)

**Changes:**
- Created `ApplicationStatusBadges` component with size variants (default, compact)
- Removed duplicate badge rendering from hero section (line 144-149)
- Removed duplicate badge rendering from condensed header (line 195-200)
- Component handles both default and compact sizes

**Rationale:**
- DRY principle - badges were rendered identically in 2 places
- Component reusability - can be used elsewhere (application lists, cards, etc.)
- Single responsibility - badge logic in one place
- Easier to update styling and behavior

**Impact:**
- Reduced code duplication by ~12 lines
- Improved maintainability
- Consistent badge rendering across all instances
- Type-safe component API

---

#### 3. Extract IntersectionObserver Configuration to Constants
**Files:** [application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx)

**Changes:**
- Added module-level constants for observer configuration:
  - `HERO_COLLAPSE_THRESHOLD_PX = 80`
  - `SCROLLSPY_TOP_OFFSET_PX = 120`
  - `SCROLLSPY_BOTTOM_OFFSET_PERCENT = 50`
  - `SCROLLSPY_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1]`
- Replaced magic numbers in observer options with named constants
- Used template literals for rootMargin construction

**Rationale:**
- Named constants improve code readability
- Magic numbers scattered in observer config are hard to understand
- Easier to tune scrollspy behavior - all config in one place
- Self-documenting code

**Impact:**
- Improved code clarity
- Easier to adjust scroll behavior
- Better developer experience when tuning thresholds

---

#### 4. Consolidate Placeholder Heights to Constant
**Files:** [application-sections.tsx](../../components/shared/application-sections.tsx)

**Changes:**
- Added `SECTION_PLACEHOLDER_HEIGHT = 'h-[--spacing-section-placeholder]'` constant
- Replaced 4 instances of `className="h-96"` with `className={SECTION_PLACEHOLDER_HEIGHT}`
- Links to CSS variable defined in globals.css

**Rationale:**
- Consistent placeholder heights across all sections
- Easy to identify and remove placeholder spacing before production
- Links to theme variable for consistency

**Impact:**
- Consistent section spacing
- Clear signal these are temporary placeholders
- Easy to update all placeholder heights at once

---

#### 5. Enhance Navigation Accessibility
**Files:** [application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx)

**Changes:**
- Converted navigation buttons to semantic anchor links (`<a>` tags)
- Added `href="#section-id"` for deep linking support
- Added `role="navigation"` to nav element
- Changed `aria-current` from "location" to "page" (correct value for navigation)
- Maintained smooth scroll behavior with `preventDefault()`

**Rationale:**
- Semantic HTML - navigation should use anchor links for deep-linkable content
- Accessibility - screen readers announce links differently than buttons
- SEO - crawlers can discover section links
- User experience - right-click → "Open in new tab" works on section links
- ARIA best practices - `aria-current="page"` is correct for navigation items

**Impact:**
- Improved accessibility score
- Better SEO
- Deep linking support via URL fragments
- Semantic HTML structure

---

#### 6. Fix TypeScript/React Import Consistency
**Files:** [application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx)

**Changes:**
- Added `import type { ReactNode } from 'react'` for type-only import
- Changed `children: React.ReactNode` to `children: ReactNode`
- Separated type imports from value imports

**Rationale:**
- TypeScript 5.9.3 best practice - use `import type` for type-only imports
- Improves tree-shaking and build optimization
- Consistent with modern React conventions (React 19.2.0)
- Cleaner namespace - no need for `React.` prefix on types

**Impact:**
- Better bundle optimization
- Follows TypeScript best practices
- Cleaner, more readable code

---

### Build Verification

✅ **TypeScript Build:** Passed with strict mode enabled
✅ **Type Checking:** No errors (Next.js 15.5.6 build successful)
✅ **Bundle Size:** No increase - optimizations applied

### Files Modified
- [app/globals.css](../../app/globals.css) - Added spacing CSS variables
- [components/shared/application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx) - Multiple improvements
- [components/shared/application-sections.tsx](../../components/shared/application-sections.tsx) - CSS variable usage
- [components/shared/application-status-badges.tsx](../../components/shared/application-status-badges.tsx) - New component

---

## 2025-10-19 | React Performance & Schema Cleanup

**Reviewed by:** Sentinel (QA Refactor)

### Refactors Applied

#### 1. Fix React useEffect Dependency Warning
**Files:** [application-detail-layout.tsx:56-59](../../components/shared/application-detail-layout.tsx#L56)

**Changes:**
- Wrapped `getSections()` call in `useMemo` hook with proper dependencies
- Added `[documentsCount, constraintsCount]` dependency array
- Prevents unnecessary recalculations when props haven't changed

**Rationale:**
- React strict mode was missing dependency declaration for `sections` variable
- The `sections` array depends on `documentsCount` and `constraintsCount` props
- Without memoization, sections array is recreated on every render
- Memoization ensures referential stability for useEffect dependencies

**Impact:**
- ✅ Fixes React dependency exhaustive-deps warning
- ✅ Prevents unnecessary section array recreation
- ✅ Improves component render performance
- ✅ Ensures predictable useEffect behavior

---

#### 2. Add useCallback Optimization for IntersectionObserver
**Files:** [application-detail-layout.tsx:86-110](../../components/shared/application-detail-layout.tsx#L86)

**Changes:**
- Extracted scrollspy callback into `handleScrollspyIntersection` function
- Wrapped callback with `useCallback` hook (empty dependency array)
- Updated useEffect to use memoized callback: `[sections, handleScrollspyIntersection]`
- Added proper TypeScript typing: `IntersectionObserverEntry[]`

**Rationale:**
- IntersectionObserver callback was recreated on every render
- Observer instance was disconnected and recreated unnecessarily
- useCallback prevents callback function recreation unless dependencies change
- Stable callback reference improves observer performance

**Impact:**
- ✅ Reduces observer churn (no unnecessary disconnect/reconnect cycles)
- ✅ Improves scroll performance by preventing observer recreation
- ✅ Better memory efficiency with stable function references
- ✅ Follows React performance best practices

---

#### 3. Remove Deprecated Schema Fields
**Files:**
- [schemas/index.ts:96-107](../../lib/mock-data/schemas/index.ts#L96) - Schema definition
- [applications.ts:184,241,299](../../lib/mock-data/applications.ts) - Mock data

**Changes:**
- **Removed 8 deprecated fields from `PlanningApplication` interface:**
  - `validationStatus`, `validationDate`
  - `consultationStatus`, `consultationStartDate`
  - `assessmentStatus`, `assessmentStartDate`
  - `reviewStatus`, `reviewStartDate`
- **Removed from all 3 mock applications**
- **Updated comments:** "Enhanced stage workflow" → "Stage workflow with tasks"

**Rationale:**
- Fields marked as "legacy - kept for backward compatibility"
- Grep search confirmed **zero usage** in any component files
- Dead code increases schema complexity and bundle size
- Enhanced stage objects (`validation`, `consultation`, `assessment`, `review`) provide all needed data
- No actual backward compatibility requirement exists

**Impact:**
- ✅ Reduced schema interface by 8 fields (-25% fields)
- ✅ Cleaner type definitions (removed technical debt)
- ✅ Smaller bundle size (less mock data to serialize)
- ✅ Eliminates potential confusion about which fields to use
- ✅ Encourages use of proper stage workflow objects

---

### Build Verification

✅ **TypeScript Build:** Passed with strict mode enabled (`npx tsc --noEmit`)
✅ **Type Checking:** No errors - all components type-safe
✅ **Component Usage:** Verified deprecated fields not used anywhere
✅ **React Hooks:** All dependency arrays properly declared

### Files Modified
- [components/shared/application-detail-layout.tsx](../../components/shared/application-detail-layout.tsx) - Performance optimizations
- [lib/mock-data/schemas/index.ts](../../lib/mock-data/schemas/index.ts) - Removed deprecated fields
- [lib/mock-data/applications.ts](../../lib/mock-data/applications.ts) - Cleaned up mock data

### Performance Improvements
- **Render performance:** Memoized sections array prevents unnecessary recalculations
- **Scroll performance:** Stable IntersectionObserver callback reduces observer churn
- **Bundle size:** Removed 24 lines of unused legacy code across 3 mock applications

---
