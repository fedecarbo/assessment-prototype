'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { PlanningApplication, Meeting } from '@/lib/mock-data/schemas'

interface MeetingsContentProps {
  application: PlanningApplication
}

type FormMode = 'list' | 'add' | 'edit'

export function MeetingsContent({ application }: MeetingsContentProps) {
  const [formMode, setFormMode] = useState<FormMode>('list')
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const meetings = application.meetings || []

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setFormMode('edit')
  }

  const handleCancelForm = () => {
    setFormMode('list')
    setEditingMeeting(null)
  }

  if (formMode === 'add') {
    return <MeetingForm onCancel={handleCancelForm} mode="add" />
  }

  if (formMode === 'edit' && editingMeeting) {
    return <MeetingForm onCancel={handleCancelForm} mode="edit" meeting={editingMeeting} />
  }

  // Group meetings by date for timeline view
  const groupedMeetings = groupMeetingsByDate(meetings)

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">Meetings</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Record upcoming meetings and keep a history of past meetings related to this application.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Action Button */}
      <div className="mt-6">
        <Button onClick={() => setFormMode('add')}>Add meeting</Button>
      </div>

      {/* Meetings Timeline - Full width */}
      <div className="mt-6">
        {groupedMeetings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No meetings have been recorded yet.</p>
        ) : (
          <div className="relative ml-0">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" style={{ marginTop: '8px' }} />
            {groupedMeetings.map(([date, dateMeetings], dateIndex) => (
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
                  <h2 className="text-base font-bold text-foreground mb-4">{date}</h2>
                </div>

                {/* Meeting Cards for this date */}
                <div className="space-y-6">
                  {dateMeetings.map((meeting, meetingIndex) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onEdit={() => handleEdit(meeting)}
                      isLast={meetingIndex === dateMeetings.length - 1 && dateIndex === groupedMeetings.length - 1}
                    />
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

// Helper function to group meetings by date
function groupMeetingsByDate(meetings: Meeting[]): [string, Meeting[]][] {
  // Sort meetings by date descending (most recent first)
  const sorted = [...meetings].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Group by date
  const grouped = new Map<string, Meeting[]>()

  sorted.forEach((meeting) => {
    const meetingDate = new Date(meeting.date)
    const dateKey = meetingDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(meeting)
  })

  return Array.from(grouped.entries())
}

interface MeetingCardProps {
  meeting: Meeting
  onEdit: () => void
  isLast?: boolean
}

function MeetingCard({ meeting, onEdit, isLast }: MeetingCardProps) {
  // Format meeting date and time
  const meetingDate = new Date(meeting.date)
  const formattedMeetingDate = meetingDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  // Use startTime directly from the meeting object
  const formattedMeetingTime = meeting.startTime

  return (
    <Card className="p-5 rounded-none border-border shadow-none hover:border-muted-foreground transition-colors">
      <div className="space-y-3">
        {/* Meeting Title and Date/Time */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">
              {meeting.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Scheduled: {formattedMeetingDate} at {formattedMeetingTime}
            </p>
          </div>
        </div>

        {/* Notes */}
        {meeting.notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {meeting.notes}
          </p>
        )}

        {/* Attachments */}
        {meeting.attachments && meeting.attachments.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Documents:</p>
            <div className="space-y-1">
              {meeting.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm text-primary hover:underline block"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Implement document download
                    console.log('Download:', attachment)
                  }}
                >
                  {attachment}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Edit Link */}
        <div className="pt-2 border-t">
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:underline"
          >
            Edit meeting
          </button>
        </div>
      </div>
    </Card>
  )
}

interface MeetingFormProps {
  onCancel: () => void
  mode: 'add' | 'edit'
  meeting?: Meeting
}

function MeetingForm({ onCancel, mode, meeting }: MeetingFormProps) {
  // Parse existing meeting data if editing
  const existingDateString = meeting?.date || ''
  const existingStartTime = meeting?.startTime || ''
  const existingEndTime = meeting?.endTime || ''

  const [title, setTitle] = useState(meeting?.title || '')
  const [type, setType] = useState<'meeting' | 'site-visit' | 'telephone-call'>(meeting?.type || 'meeting')
  const [meetingDate, setMeetingDate] = useState(existingDateString)
  const [startTime, setStartTime] = useState(existingStartTime)
  const [endTime, setEndTime] = useState(existingEndTime)
  const [description, setDescription] = useState(meeting?.description || '')
  const [location, setLocation] = useState(meeting?.location || '')
  const [meetingNotes, setMeetingNotes] = useState(meeting?.meetingNotes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement meeting creation/update logic
    console.log(mode === 'add' ? 'Creating meeting:' : 'Updating meeting:', {
      title,
      type,
      date: meetingDate,
      startTime,
      endTime,
      description,
      location,
      meetingNotes
    })

    // For now, just close the form
    onCancel()
  }

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === 'add' ? 'Add meeting' : 'Edit meeting'}
        </h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            {mode === 'add'
              ? 'Record details of an upcoming meeting related to this application.'
              : 'Update the meeting details below.'}
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Form - constrained to 723px for readability */}
      <div className="mt-6 max-w-readable">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Meeting title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Pre-application meeting with applicant"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* Meeting Type Field */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
              Type <span className="text-red-600">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'meeting' | 'site-visit' | 'telephone-call')}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="meeting">Meeting</option>
              <option value="site-visit">Site visit</option>
              <option value="telephone-call">Telephone call</option>
            </select>
          </div>

          {/* Meeting Date Field */}
          <div>
            <label htmlFor="meetingDate" className="block text-sm font-medium text-foreground mb-2">
              Meeting date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="meetingDate"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* Start Time Field */}
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-foreground mb-2">
              Start time <span className="text-red-600">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* End Time Field */}
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-foreground mb-2">
              End time <span className="text-red-600">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. Meeting link, address, or phone number"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="What will be discussed and who should attend"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
            />
          </div>

          {/* Meeting Notes Field */}
          <div>
            <label htmlFor="meetingNotes" className="block text-sm font-medium text-foreground mb-2">
              Meeting notes (optional)
            </label>
            <textarea
              id="meetingNotes"
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              rows={8}
              placeholder="Notes taken during or after the meeting"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit">
              {mode === 'add' ? 'Add meeting' : 'Save changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
