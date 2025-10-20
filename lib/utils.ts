import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to GB locale format
 * @param dateString - ISO date string
 * @param format - Month format: 'long' for full month name, 'short' for abbreviated
 * @returns Formatted date (e.g., "5 January 2025" or "5 Jan 2025")
 */
export function formatDate(dateString: string, format: 'long' | 'short' = 'long'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: format === 'long' ? 'long' : 'short',
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

/**
 * Truncate text to a specified number of words
 * @param text - Text to truncate
 * @param wordLimit - Maximum number of words
 * @returns Truncated text with ellipsis if needed
 */
export function truncateToWords(text: string, wordLimit: number): string {
  const words = text.split(' ')
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(' ') + '...'
}

/**
 * Format consultation topic label
 * @param topic - Topic key
 * @returns Human-readable topic label
 */
export function formatTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    'design': 'Design',
    'privacy': 'Privacy',
    'loss-of-light': 'Loss of light',
    'traffic': 'Traffic',
    'accessibility': 'Accessibility',
    'noise': 'Noise',
    'other': 'Other'
  }
  return labels[topic] || topic
}

// Constants for UI thresholds
export const RESPONSE_PREVIEW_WORD_LIMIT = 40
export const CONSULTEE_SUMMARY_WORD_LIMIT = 30
