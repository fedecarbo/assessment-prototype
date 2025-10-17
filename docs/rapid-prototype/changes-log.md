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
