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
