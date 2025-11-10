import type { PlanningApplication, Meeting, Document } from './mock-data/schemas'

export type TimelineEventType =
  | 'meeting'
  | 'site-visit'
  | 'telephone-call'
  | 'document-upload'
  | 'milestone'

export type TimelineEventCategory =
  | 'meetings-visits'
  | 'documents'
  | 'milestones'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  category: TimelineEventCategory
  date: string
  title: string
  description?: string
  metadata?: Record<string, any>
}

/**
 * Aggregates all timeline events from a planning application
 */
export function getTimelineEvents(application: PlanningApplication): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // 1. Add meetings and visits
  if (application.meetings) {
    application.meetings.forEach((meeting: Meeting) => {
      // Combine date and startTime to create ISO datetime string
      const meetingDateTime = `${meeting.date}T${meeting.startTime}:00`

      events.push({
        id: `meeting-${meeting.id}`,
        type: meeting.type,
        category: 'meetings-visits',
        date: meetingDateTime,
        title: meeting.title,
        description: meeting.description,
        metadata: {
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          location: meeting.location,
          meetingNotes: meeting.meetingNotes,
          photos: meeting.photos,
          recordedBy: meeting.recordedBy
        }
      })
    })
  }

  // 2. Add document uploads (only applicant uploads, not all documents)
  // Note: In a real system, you'd filter by uploadedBy === applicant
  if (application.documents) {
    application.documents.forEach((doc: Document) => {
      events.push({
        id: `doc-${doc.id}`,
        type: 'document-upload',
        category: 'documents',
        date: doc.uploadedDate,
        title: `Uploaded ${doc.name}`,
        description: doc.category,
        metadata: {
          fileSize: doc.fileSize,
          fileType: doc.fileType,
          tags: doc.tags
        }
      })
    })
  }

  // 3. Add application milestones

  // Application submitted
  if (application.submittedDate) {
    events.push({
      id: 'milestone-submitted',
      type: 'milestone',
      category: 'milestones',
      date: application.submittedDate,
      title: 'Application submitted',
      description: 'We have received your planning application and will begin processing it.'
    })
  }

  // Application validated
  if (application.validationStage?.completedDate) {
    events.push({
      id: 'milestone-validated',
      type: 'milestone',
      category: 'milestones',
      date: application.validationStage.completedDate,
      title: 'Application accepted',
      description: 'Your application is complete and has been accepted for processing. The planning team will now review your proposal.'
    })
  }

  // Consultation started
  if (application.consultationStage?.startDate) {
    events.push({
      id: 'milestone-consultation-start',
      type: 'milestone',
      category: 'milestones',
      date: application.consultationStage.startDate,
      title: 'Public consultation opened',
      description: 'We are now consulting neighbours and relevant organisations about your application. They have time to provide comments.'
    })
  }

  // Consultation ended
  if (application.consultationEnd) {
    events.push({
      id: 'milestone-consultation-end',
      type: 'milestone',
      category: 'milestones',
      date: application.consultationEnd,
      title: 'Public consultation closed',
      description: 'The consultation period has ended. We are now reviewing all comments received.'
    })
  }

  // Assessment stage completed
  if (application.assessmentStage?.completedDate) {
    events.push({
      id: 'milestone-assessment-complete',
      type: 'milestone',
      category: 'milestones',
      date: application.assessmentStage.completedDate,
      title: 'Assessment complete',
      description: 'Our planning team has finished assessing your application against planning policies. Your application is now being reviewed by senior officers.'
    })
  }

  // Review stage completed
  if (application.reviewStage?.completedDate) {
    events.push({
      id: 'milestone-review-complete',
      type: 'milestone',
      category: 'milestones',
      date: application.reviewStage.completedDate,
      title: 'Final review complete',
      description: 'Senior officers have completed their review. A decision on your application will be made soon.'
    })
  }

  // Decision made
  if (application.outcome && application.outcomeDate) {
    const outcomeDescriptions: Record<string, string> = {
      'approved': 'Your planning application has been approved. You will receive formal notification with any conditions attached to the permission.',
      'rejected': 'Your planning application has been refused. You will receive formal notification explaining the reasons for refusal and your right to appeal.',
      'withdrawn': 'Your application has been withdrawn as requested.',
    }

    events.push({
      id: 'milestone-decision',
      type: 'milestone',
      category: 'milestones',
      date: application.outcomeDate,
      title: `Application ${application.outcome}`,
      description: outcomeDescriptions[application.outcome] || `Your application has been ${application.outcome}.`
    })
  }

  return events
}

/**
 * Filters events by category
 */
export function filterEventsByCategory(
  events: TimelineEvent[],
  category: TimelineEventCategory | 'all'
): TimelineEvent[] {
  if (category === 'all') return events
  return events.filter(event => event.category === category)
}

/**
 * Separates events into upcoming and past
 */
export function separateUpcomingAndPast(events: TimelineEvent[]): {
  upcoming: TimelineEvent[]
  past: TimelineEvent[]
} {
  const now = new Date()
  const upcoming: TimelineEvent[] = []
  const past: TimelineEvent[] = []

  events.forEach(event => {
    const eventDate = new Date(event.date)
    if (eventDate > now && (event.type === 'meeting' || event.type === 'site-visit' || event.type === 'telephone-call')) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  })

  // Sort upcoming ascending (soonest first)
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Sort past descending (most recent first)
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return { upcoming, past }
}

/**
 * Groups upcoming events by relative time periods
 */
export function groupUpcomingByRelativeTime(events: TimelineEvent[]): [string, TimelineEvent[]][] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)

  const groups = new Map<string, TimelineEvent[]>()
  groups.set('Today', [])
  groups.set('Tomorrow', [])
  groups.set('In 7 days', [])
  groups.set('Later', [])

  events.forEach(event => {
    const eventDate = new Date(event.date)
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

    if (eventDay.getTime() === today.getTime()) {
      groups.get('Today')!.push(event)
    } else if (eventDay.getTime() === tomorrow.getTime()) {
      groups.get('Tomorrow')!.push(event)
    } else if (eventDay > tomorrow && eventDay <= in7Days) {
      groups.get('In 7 days')!.push(event)
    } else {
      groups.get('Later')!.push(event)
    }
  })

  // Return only non-empty groups
  return Array.from(groups.entries()).filter(([_, events]) => events.length > 0)
}

/**
 * Groups events by date for timeline display
 */
export function groupEventsByDate(events: TimelineEvent[]): [string, TimelineEvent[]][] {
  const grouped = new Map<string, TimelineEvent[]>()

  events.forEach((event) => {
    const eventDate = new Date(event.date)
    const dateKey = eventDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(event)
  })

  return Array.from(grouped.entries())
}

/**
 * Gets a badge label for event type
 */
export function getEventTypeBadge(type: TimelineEventType): { label: string; variant: string } {
  switch (type) {
    case 'meeting':
      return { label: 'Meeting', variant: 'blue' }
    case 'site-visit':
      return { label: 'Site visit', variant: 'turquoise' }
    case 'telephone-call':
      return { label: 'Phone call', variant: 'purple' }
    case 'document-upload':
      return { label: 'Document', variant: 'green' }
    case 'milestone':
      return { label: 'Milestone', variant: 'light-blue' }
    default:
      return { label: 'Event', variant: 'grey' }
  }
}
