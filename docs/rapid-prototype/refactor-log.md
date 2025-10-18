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
