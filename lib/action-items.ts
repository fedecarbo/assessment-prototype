/**
 * Non-linear action items that appear in the Task Panel
 * These are not part of the linear assessment workflow but provide access to supporting features
 */

export interface ActionItem {
  id: number
  label: string
  href: string
}

export const ACTION_ITEMS: ActionItem[] = [
  { id: 998, label: 'Activity', href: '?task=998' },
  { id: 997, label: 'Fees and services', href: '?task=997' },
  { id: 996, label: 'Meetings', href: '?task=996' },
  { id: 995, label: 'Site visits', href: '?task=995' },
  { id: 999, label: 'Applicant requests', href: '?task=999' },
  { id: 994, label: 'Notes', href: '?task=994' },
]

/**
 * Get action item by ID
 */
export function getActionItemById(id: number): ActionItem | undefined {
  return ACTION_ITEMS.find(item => item.id === id)
}

/**
 * Check if a task ID is an action item
 */
export function isActionItem(taskId: number): boolean {
  return ACTION_ITEMS.some(item => item.id === taskId)
}
