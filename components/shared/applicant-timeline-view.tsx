'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { PlanningApplication } from '@/lib/mock-data/schemas'
import {
  getTimelineEvents,
  separateUpcomingAndPast,
  groupEventsByDate,
  getEventTypeBadge,
  type TimelineEvent
} from '@/lib/timeline-utils'

interface ApplicantTimelineViewProps {
  application: PlanningApplication
}

export function ApplicantTimelineView({ application }: ApplicantTimelineViewProps) {
  // Get all timeline events
  const allEvents = getTimelineEvents(application)
  const { upcoming, past } = separateUpcomingAndPast(allEvents)

  // Group past events by date
  const groupedPast = groupEventsByDate(past)

  return (
    <>
      {/* Title and Description */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Timeline</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Track all events and updates related to your planning application.
          </p>
        </div>
      </div>

      {/* Divider */}
      <Separator className="mt-6" />

      {/* Application Context Banner */}
      <div className="mt-6 p-4 bg-muted/50 rounded-none border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              Application {application.id}: {application.address}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
              {application.submittedDate && ` • Submitted: ${new Date(application.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              {application.expiryDate && ` • Decision by: ${new Date(application.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming meetings or site visits scheduled.
          </p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Activity History Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Activity history</h2>

        {/* Timeline */}
        {groupedPast.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity to display.</p>
        ) : (
          <div className="relative ml-0">
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" style={{ marginTop: '8px' }} />

            {groupedPast.map(([date, dateEvents], dateIndex) => (
              <div key={date} className="relative pb-8 last:pb-0 pl-8">
                {/* Date Header with Timeline Marker */}
                <div className="relative">
                  {/* Timeline horizontal line marker */}
                  <div
                    className="absolute bg-primary"
                    style={{
                      width: '30px',
                      height: '4px',
                      left: '-40px',
                      top: '8px'
                    }}
                  />

                  {/* Date Text */}
                  <h3 className="text-base font-bold text-foreground mb-4">{date}</h3>
                </div>

                {/* Event Cards for this date */}
                <div className="space-y-6">
                  {dateEvents.map((event) => (
                    <TimelineEventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

interface UpcomingEventCardProps {
  event: TimelineEvent
}

function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const formattedTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const typeBadge = getEventTypeBadge(event.type)

  // Generate calendar link (ICS format)
  const handleAddToCalendar = () => {
    // Format date for ICS (YYYYMMDDTHHMMSS)
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    // Add 1 hour duration
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-5 rounded-none border-border shadow-none">
      <div className="space-y-2">
        {/* Header with Title and Type Badge */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-foreground flex-1">
            {event.title}
          </h3>
          <Badge variant={typeBadge.variant as any}>
            {typeBadge.label}
          </Badge>
        </div>

        {/* Date and Time */}
        <p className="text-sm text-muted-foreground">
          Scheduled: {formattedDate} at {formattedTime}
        </p>

        {/* Description/Notes */}
        {event.description && (
          <p className="text-sm text-foreground leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Attachments for upcoming events */}
        {event.metadata?.attachments && event.metadata.attachments.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-foreground mb-2">
              {event.metadata.attachments.length} {event.metadata.attachments.length === 1 ? 'document' : 'documents'}:
            </p>
            <div className="space-y-1">
              {event.metadata.attachments.map((filename: string, index: number) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Implement document download
                    console.log('Download:', filename)
                  }}
                  className="text-sm text-primary hover:underline block"
                >
                  {filename}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Add to calendar link */}
        <div className="pt-2 border-t">
          <button
            onClick={handleAddToCalendar}
            className="text-sm text-primary hover:underline"
          >
            Add to calendar
          </button>
        </div>
      </div>
    </Card>
  )
}

interface TimelineEventCardProps {
  event: TimelineEvent
}

function TimelineEventCard({ event }: TimelineEventCardProps) {
  const eventDate = new Date(event.date)
  const hasTime = event.type === 'meeting' || event.type === 'site-visit' || event.type === 'telephone-call'

  const formattedTime = hasTime
    ? eventDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    : null

  const typeBadge = getEventTypeBadge(event.type)

  return (
    <Card className="p-5 rounded-none border-border shadow-none hover:border-muted-foreground transition-colors">
      <div className="space-y-2">
        {/* Header with Title and Type Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-base font-bold text-foreground">
              {event.title}
            </h4>
            {formattedTime && (
              <p className="text-sm text-muted-foreground mt-1">
                {formattedTime}
              </p>
            )}
          </div>
          <Badge variant={typeBadge.variant as any}>
            {typeBadge.label}
          </Badge>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Attachments */}
        {event.metadata?.attachments && event.metadata.attachments.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-foreground mb-2">
              {event.metadata.attachments.length} {event.metadata.attachments.length === 1 ? 'document' : 'documents'}:
            </p>
            <div className="space-y-1">
              {event.metadata.attachments.map((filename: string, index: number) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Implement document download
                    console.log('Download:', filename)
                  }}
                  className="text-sm text-primary hover:underline block"
                >
                  {filename}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
