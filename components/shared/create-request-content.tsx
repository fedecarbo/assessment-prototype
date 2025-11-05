'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { PlanningApplication } from '@/lib/mock-data/schemas'

interface CreateRequestContentProps {
  application: PlanningApplication
}

export function CreateRequestContent({ application }: CreateRequestContentProps) {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { subject?: string; description?: string } = {}
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // In real app, this would save to backend
    // For now, just navigate back
    router.push(`/application/${application.id}/assessment?task=999`)
  }

  const handleCancel = () => {
    router.push(`/application/${application.id}/assessment?task=999`)
  }

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">Create applicant request</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Request additional information or documents from the applicant to support your assessment.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Form - constrained to 723px for readability */}
      <div className="mt-8 max-w-readable">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject <span className="text-red">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (errors.subject) setErrors({ ...errors, subject: undefined })
              }}
              placeholder="e.g., Clarification on drainage system design"
              className={errors.subject ? 'border-red' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              placeholder="Provide details about what information or documents you need..."
              rows={8}
              className={errors.description ? 'border-red' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Be specific about what you need and why it's required for the assessment.
            </p>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due date (optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Can't set due date in the past
              className="max-w-[200px]"
            />
            <p className="text-sm text-muted-foreground">
              Set a deadline for the applicant to respond.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit">Send request</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
