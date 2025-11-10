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
 *
 * @param status - The current request status
 * @returns ReactElement - The corresponding Badge component
 */
export function getRequestStatusBadge(status: ApplicantRequestStatus): ReactElement {
  switch (status) {
    case 'sent':
      return <Badge variant="blue">Sent</Badge>
    case 'responded':
      return <Badge variant="green">Responded</Badge>
    case 'not-sent-yet':
      return <Badge variant="grey">Not sent yet</Badge>
    case 'closed':
      return <Badge variant="grey">Closed</Badge>
    case 'cancelled':
      return <Badge variant="red">Cancelled</Badge>
    default:
      // Exhaustive check: TypeScript will error if new status added but not handled
      const _exhaustive: never = status
      return _exhaustive
  }
}
