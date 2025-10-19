'use client'

import { useAssessment, type TaskStatus } from './assessment-context'
import { Badge } from '@/components/ui/badge'

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return <Badge variant="black">Completed</Badge>
    case 'in-progress':
      return <Badge variant="blue">In progress</Badge>
    case 'not-started':
      return <Badge variant="gray">Not started</Badge>
  }
}

export function AssessmentContent() {
  const { selectedTaskId, tasks } = useAssessment()
  const currentTask = tasks.find(task => task.id === selectedTaskId)

  if (!currentTask) return null

  return (
    <div className="py-8">
      <div className="flex items-center gap-3">
        {getStatusBadge(currentTask.status)}
      </div>
      <h1 className="mt-2 text-xl font-bold text-foreground">{currentTask.title}</h1>
      <p className="mt-4 text-muted-foreground">
        Content for the selected task. Click different tasks in the left panel to switch content.
      </p>

      {/* Placeholder content to demonstrate scrolling */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="rounded border border-border bg-muted p-4">
            <h3 className="font-semibold">Section {i + 1} for {currentTask.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is placeholder content for {currentTask.title}.
              The task panel on the left scrolls independently from this main content area.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
