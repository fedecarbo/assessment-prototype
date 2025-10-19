'use client'

import { useAssessment, type TaskStatus } from './assessment-context'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
      <div className="mt-6 flex items-center justify-center bg-muted" style={{ minHeight: '300px' }}>
        <p className="text-lg text-muted-foreground">Content coming soon</p>
      </div>
    </div>
  )
}
