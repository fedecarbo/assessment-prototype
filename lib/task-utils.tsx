import type { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'
import type { TaskStatus } from '@/components/shared/assessment-context'
import type { ApplicantRequestStatus } from './mock-data/schemas'

/**
 * Returns the appropriate status badge component for a given task status.
 * Uses exhaustive type checking to ensure all TaskStatus values are handled.
 *
 * @param status - The current task status
 * @returns ReactElement - The corresponding Badge component
 */
export function getStatusBadge(status: TaskStatus): ReactElement {
  switch (status) {
    case 'completed':
      return <Badge variant="green">Completed</Badge>
    case 'in-progress':
      return <Badge variant="light-blue">In progress</Badge>
    case 'needs-review':
      return <Badge variant="yellow">Needs review</Badge>
    case 'not-started':
      return <Badge variant="gray">Not started</Badge>
    case 'locked':
      return <Badge variant="gray">Locked</Badge>
    default:
      // Exhaustive check: TypeScript will error if new status added but not handled
      const _exhaustive: never = status
      return _exhaustive
  }
}

/**
 * Returns the appropriate status badge component for an applicant request.
 * Handles overdue detection by comparing due date with today.
 *
 * @param status - The current request status
 * @param dueDate - Optional due date in YYYY-MM-DD format
 * @returns ReactElement - The corresponding Badge component
 */
export function getRequestStatusBadge(status: ApplicantRequestStatus, dueDate?: string): ReactElement {
  // Check if pending request is overdue
  if (status === 'pending' && dueDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to start of day for fair comparison
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    if (due < today) {
      return <Badge variant="red">Overdue</Badge>
    }
  }

  switch (status) {
    case 'pending':
      return <Badge variant="blue">Pending</Badge>
    case 'responded':
      return <Badge variant="green">Responded</Badge>
    case 'overdue':
      return <Badge variant="red">Overdue</Badge>
    default:
      // Exhaustive check: TypeScript will error if new status added but not handled
      const _exhaustive: never = status
      return _exhaustive
  }
}
