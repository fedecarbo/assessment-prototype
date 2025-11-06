'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreateRequestContentProps {
  applicationId: string
}

export function CreateRequestContent({ applicationId }: CreateRequestContentProps) {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Handle form submission - create new request
    console.log('Creating request:', { subject, message })

    // Navigate back to requests list
    router.push(`/application/${applicationId}/assessment?task=999`)
  }

  const handleCancel = () => {
    router.push(`/application/${applicationId}/assessment?task=999`)
  }

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">New request</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Request additional information or documents from the applicant to support your assessment.
            The applicant will be notified and can respond through their portal.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Form */}
      <div className="mt-6 max-w-readable">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject
              <span className="text-red-600 ml-1">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Clarification on drainage system design"
              required
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message
              <span className="text-red-600 ml-1">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what information or documents you need from the applicant..."
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground">
              Be specific about what you need and why it's required for the assessment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit">
              Send request
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
