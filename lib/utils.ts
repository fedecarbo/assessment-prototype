import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to GB locale format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "5 January 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Calculate percentage response rate
 * @param responses - Number of responses received
 * @param total - Total number contacted/notified
 * @returns Rounded percentage (0-100)
 */
export function calculateResponseRate(responses: number, total: number): number {
  if (total === 0) return 0
  return Math.round((responses / total) * 100)
}

/**
 * Get formatted label for document category
 * @param category - Document category key
 * @returns Human-readable category label
 */
export function getDocumentCategoryLabel(category: string): string {
  switch (category) {
    case 'drawings':
      return 'Drawings'
    case 'supporting':
      return 'Supporting'
    case 'evidence':
      return 'Evidence'
    default:
      return category
  }
}

/**
 * Get formatted label for document visibility
 * @param visibility - Document visibility level
 * @returns Human-readable visibility label
 */
export function getDocumentVisibilityLabel(visibility: 'public' | 'sensitive'): string {
  return visibility === 'public' ? 'Public' : 'Sensitive'
}
