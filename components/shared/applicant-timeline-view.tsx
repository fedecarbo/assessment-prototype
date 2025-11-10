'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { PlanningApplication } from '@/lib/mock-data/schemas'
import {
  getTimelineEvents,
  separateUpcomingAndPast,
  groupUpcomingByRelativeTime,
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

  // Group upcoming by relative time, past by absolute date
  const groupedUpcoming = groupUpcomingByRelativeTime(upcoming)
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

      {/* Upcoming Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming</h2>

        {/* Timeline */}
        {groupedUpcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming meetings or site visits scheduled.
          </p>
        ) : (
          <div className="relative ml-0">
            {/* Vertical timeline line - BLUE */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" style={{ marginTop: '8px' }} />

            {groupedUpcoming.map(([date, dateEvents], dateIndex) => (
              <div key={date} className="relative pb-8 last:pb-0 pl-8">
                {/* Date Header with Timeline Marker */}
                <div className="relative">
                  {/* Timeline horizontal line marker - BLUE */}
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
                    <UpcomingEventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
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
            {/* Vertical timeline line - GREY */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-border" style={{ marginTop: '8px' }} />

            {groupedPast.map(([date, dateEvents], dateIndex) => (
              <div key={date} className="relative pb-8 last:pb-0 pl-8">
                {/* Date Header with Timeline Marker */}
                <div className="relative">
                  {/* Timeline horizontal line marker - GREY */}
                  <div
                    className="absolute bg-border"
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
  const typeBadge = getEventTypeBadge(event.type)
  const startTime = event.metadata?.startTime || '00:00'
  const endTime = event.metadata?.endTime || '00:00'

  const getLocationDisplay = () => {
    if (!event.metadata?.location) return null
    const location = event.metadata.location

    if (event.type === 'meeting' && (location.startsWith('http://') || location.startsWith('https://'))) {
      return (
        <a
          href={location}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {location}
        </a>
      )
    }

    if (event.type === 'telephone-call') {
      return <a href={`tel:${location}`} className="text-primary hover:underline">{location}</a>
    }

    return <span>{location}</span>
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const generateCalendarFile = () => {
    const [startHour, startMin] = startTime.split(':')
    const [endHour, endMin] = endTime.split(':')

    const startDateTime = new Date(event.date)
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0)

    const endDateTime = new Date(event.date)
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0)

    const formatDateForICal = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Planning Application//Meeting//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForICal(startDateTime)}`,
      `DTEND:${formatDateForICal(endDateTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description?.replace(/\n/g, '\\n') || ''}`,
      `LOCATION:${event.metadata?.location || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="p-5 rounded-none border-border shadow-none hover:border-muted-foreground transition-colors">
      <div className="space-y-3">
        {/* Header: Title and Badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground flex-1">
            {event.title}
          </h3>
          <Badge variant={typeBadge.variant as any}>
            {typeBadge.label}
          </Badge>
        </div>

        {/* Date, Time, Location */}
        <div className="space-y-1">
          <p className="text-sm text-foreground">
            <span className="font-bold">When:</span> {formattedDate}, {startTime} - {endTime}
            {' • '}
            <button
              onClick={generateCalendarFile}
              className="text-primary hover:underline"
            >
              Add to calendar
            </button>
          </p>
          {event.metadata?.location && (
            <p className="text-sm text-foreground">
              <span className="font-bold">Location:</span> {getLocationDisplay()}
            </p>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <p className="text-sm font-bold text-foreground mb-1">Description</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

interface TimelineEventCardProps {
  event: TimelineEvent
}

function TimelineEventCard({ event }: TimelineEventCardProps) {
  const hasTime = event.type === 'meeting' || event.type === 'site-visit' || event.type === 'telephone-call'
  const typeBadge = getEventTypeBadge(event.type)

  const startTime = event.metadata?.startTime
  const endTime = event.metadata?.endTime
  const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : null

  const getLocationDisplay = () => {
    if (!event.metadata?.location) return null
    const location = event.metadata.location

    if (event.type === 'meeting' && (location.startsWith('http://') || location.startsWith('https://'))) {
      return (
        <a
          href={location}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Join meeting
        </a>
      )
    }

    if (event.type === 'telephone-call') {
      return <a href={`tel:${location}`} className="text-primary hover:underline">{location}</a>
    }

    return <span>{location}</span>
  }

  return (
    <Card className="p-5 rounded-none border-border shadow-none hover:border-muted-foreground transition-colors">
      <div className="space-y-3">
        {/* Header: Badge and Title */}
        <div>
          <Badge variant={typeBadge.variant as any} className="mb-2">
            {typeBadge.label}
          </Badge>
          <h3 className="text-base font-bold text-foreground">
            {event.title}
          </h3>
          {timeRange && (
            <p className="text-sm text-muted-foreground mt-1">{timeRange}</p>
          )}
        </div>

        {/* Location (for meetings/visits) */}
        {event.metadata?.location && hasTime && (
          <div className="flex gap-3">
            <span className="w-20 text-sm font-medium text-muted-foreground">
              {event.type === 'meeting' && event.metadata.location.startsWith('http') ? 'Link' :
               event.type === 'site-visit' ? 'Address' :
               event.type === 'telephone-call' ? 'Phone' : 'Location'}
            </span>
            <span className="text-sm text-foreground">{getLocationDisplay()}</span>
          </div>
        )}

        {/* Description (what the meeting is about) */}
        {event.description && (
          <div>
            <p className="text-sm font-medium text-foreground mb-1">About this {event.type === 'site-visit' ? 'visit' : event.type === 'telephone-call' ? 'call' : 'meeting'}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {/* Meeting Notes */}
        {event.metadata?.meetingNotes && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-foreground mb-1">Notes</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.metadata.meetingNotes}
            </p>
          </div>
        )}

        {/* Photos */}
        {event.metadata?.photos && event.metadata.photos.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-foreground mb-2">
              {event.metadata.photos.length} {event.metadata.photos.length === 1 ? 'photo' : 'photos'}
            </p>
            <div className="space-y-1">
              {event.metadata.photos.map((filename: string, index: number) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('View photo:', filename)
                  }}
                  className="text-sm text-primary hover:underline block"
                >
                  {filename}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Attachments (documents) */}
        {event.metadata?.attachments && event.metadata.attachments.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-foreground mb-2">
              {event.metadata.attachments.length} {event.metadata.attachments.length === 1 ? 'document' : 'documents'}
            </p>
            <div className="space-y-1">
              {event.metadata.attachments.map((filename: string, index: number) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
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
