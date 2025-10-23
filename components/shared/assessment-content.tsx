'use client'

import { useAssessment, type TaskStatus } from './assessment-context'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return <Badge variant="green">Completed</Badge>
    case 'in-progress':
      return <Badge variant="light-blue">In progress</Badge>
    case 'not-started':
      return <Badge variant="gray">Not started</Badge>
  }
}

export function AssessmentContent() {
  const { selectedTaskId, taskMap, updateTaskStatus, contentScrollRef } = useAssessment()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showDraftMessage, setShowDraftMessage] = useState(false)

  // O(1) lookup using task map
  const currentTask = taskMap.get(selectedTaskId)

  // Hide messages when task changes
  useEffect(() => {
    setShowSuccessMessage(false)
    setShowDraftMessage(false)
  }, [selectedTaskId])

  if (!currentTask) return null

  const handleSaveAndComplete = () => {
    updateTaskStatus(selectedTaskId, 'completed')
    setShowSuccessMessage(true)
    setShowDraftMessage(false)
    contentScrollRef?.current?.scrollTo({ top: 0 })
  }

  const handleSaveDraft = () => {
    updateTaskStatus(selectedTaskId, 'in-progress')
    setShowDraftMessage(true)
    setShowSuccessMessage(false)
    contentScrollRef?.current?.scrollTo({ top: 0 })
  }

  return (
    <div className="py-8">
      {/* Success Message - Full width */}
      {showSuccessMessage && (
        <div className="mb-4 border-[5px] border-[#00703c]">
          <div className="bg-[#00703c] border-b border-b-[#00703c] px-4 pt-[2px] pb-[5px]">
            <p className="text-base font-bold text-white">Success</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-base text-foreground">Task completed successfully</p>
          </div>
        </div>
      )}

      {/* Draft Saved Message - Full width */}
      {showDraftMessage && (
        <div className="mb-4 border-[5px] border-primary">
          <div className="bg-primary border-b border-b-primary px-4 pt-[2px] pb-[5px]">
            <p className="text-base font-bold text-white">Draft saved</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-base text-foreground">Your draft has been saved</p>
          </div>
        </div>
      )}

      {/* Content constrained to 723px for readability */}
      <div style={{ maxWidth: '723px' }}>
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {getStatusBadge(currentTask.status)}
        </div>

        {/* Task Title */}
        <h1 className="mt-2 text-2xl font-bold text-foreground">{currentTask.title}</h1>

        {/* Task Description/Instruction */}
        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            {currentTask.description}
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Content coming soon placeholder */}
      <div className="mt-6 flex items-center justify-center bg-muted" style={{ minHeight: '400px' }}>
        <p className="text-lg text-muted-foreground">Content coming soon</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button onClick={handleSaveAndComplete}>
          Save and mark as complete
        </Button>
        <Button variant="secondary" onClick={handleSaveDraft}>
          Save draft
        </Button>
      </div>
    </div>
  )
}
