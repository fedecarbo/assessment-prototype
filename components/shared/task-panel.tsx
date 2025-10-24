/**
 * TASK PANEL - VERSION SWITCHER
 *
 * This file supports two versions of TaskPanel that can be toggled via environment variable.
 *
 * HOW TO SWITCH VERSIONS:
 * 1. Create/edit .env.local file in project root
 * 2. Add: NEXT_PUBLIC_TASK_PANEL_VERSION=future
 * 3. Restart your dev server (npm run dev)
 * 4. To revert: remove the line or set to 'current'
 *
 * CURRENT VERSION: The stable, production version
 * FUTURE VERSION: Experimental version for development/testing
 */

import { memo } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { useFutureAssessment } from './future-assessment-context'
import { Check, Plus } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

// Feature flag to switch between versions
const TASK_PANEL_VERSION = process.env.NEXT_PUBLIC_TASK_PANEL_VERSION || 'current'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getCheckbox(status: TaskStatus, isSelected: boolean) {
  if (status === 'completed') {
    return (
      <div className={`flex h-5 w-5 flex-none items-center justify-center rounded-sm ${
        isSelected ? 'bg-white/20' : 'bg-muted-foreground/10'
      }`}>
        <Check className={`h-3.5 w-3.5 ${
          isSelected ? 'text-white' : 'text-foreground'
        }`} strokeWidth={2.5} />
      </div>
    )
  }

  if (status === 'in-progress') {
    return (
      <div className={`flex h-5 w-5 flex-none items-center justify-center rounded-sm ${
        isSelected ? 'bg-white/20' : 'bg-[hsl(211,66%,41%)]/10'
      }`}>
        <div className={`h-0.5 w-2.5 ${
          isSelected ? 'bg-white' : 'bg-[hsl(211,66%,41%)]'
        }`} />
      </div>
    )
  }

  return (
    <div className={`h-5 w-5 flex-none rounded-sm ${
      isSelected ? 'bg-white/20' : 'bg-[hsl(211,66%,41%)]/10'
    }`} />
  )
}

function getStatusIcon(status: TaskStatus | undefined, isSelected: boolean) {
  // No status: + icon (for action items like "Add new service")
  if (!status) {
    return (
      <Plus className={`h-4 w-4 flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`} strokeWidth={2} />
    )
  }

  // Completed: Filled circle with checkmark
  if (status === 'completed') {
    if (isSelected) {
      return (
        <div className="flex h-4 w-4 flex-none items-center justify-center rounded-full border-[1.5px] border-background dark:border-white bg-background dark:bg-white">
          <Check className="h-3 w-3 text-primary dark:text-[hsl(211,66%,43%)]" strokeWidth={2.5} />
        </div>
      )
    }
    return (
      <div className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-primary">
        <Check className="h-3 w-3 text-background" strokeWidth={2.5} />
      </div>
    )
  }

  // In progress: Light blue filled circle with brand blue border
  if (status === 'in-progress') {
    if (isSelected) {
      return (
        <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-background dark:border-white" style={{ backgroundColor: 'var(--tag-light-blue-bg)' }} />
      )
    }
    return (
      <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-primary" style={{ backgroundColor: 'var(--tag-light-blue-bg)' }} />
    )
  }

  // Not started: Dashed border, grey (white when selected)
  if (isSelected) {
    return (
      <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-dashed border-background dark:border-white" />
    )
  }
  return (
    <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-dashed border-muted-foreground" />
  )
}

// ============================================================================
// CURRENT VERSION (Stable/Production)
// ============================================================================

const CurrentTaskPanel = ({ selectedTaskId, onTaskSelect }: TaskPanelProps) => {
  const { taskGroups } = useAssessment()

  return (
    <aside className="w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-lg font-bold text-foreground mb-6">Assessment tasks</h2>
      <div className="space-y-6">
        {taskGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-base text-foreground mb-2">
              {group.title}
            </h3>
            <div className="space-y-0">
              {group.tasks.map((task) => {
                const isSelected = selectedTaskId === task.id
                const isCompleted = task.status === 'completed'

                return (
                  <Link
                    key={task.id}
                    href={`?task=${task.id}`}
                    onClick={() => onTaskSelect(task.id)}
                    className={`flex items-center justify-between gap-3 p-2 transition-colors no-underline ${
                      isSelected
                        ? 'bg-[hsl(211,66%,41%)]'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className={`text-base leading-tight ${
                      isSelected
                        ? 'text-white'
                        : 'text-primary'
                    }`}>
                      {task.title}
                    </span>
                    {getCheckbox(task.status, isSelected)}
                  </Link>
                )
              })}
            </div>
            {groupIndex < taskGroups.length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

// ============================================================================
// FUTURE VERSION (Experimental/Development)
// ============================================================================

const FutureTaskPanel = ({ selectedTaskId, onTaskSelect }: TaskPanelProps) => {
  // Use future assessment context for stateful tasks
  const { futureTasks } = useFutureAssessment()

  return (
    <aside className="w-full md:w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-lg font-bold text-foreground mb-2">Assessment tasks</h2>

      {/* Preview Report CTA */}
      <a href="#" className="text-sm text-primary underline hover:no-underline mb-6 block">
        Preview report
      </a>

      {/* Task List */}
      <div className="space-y-6">
        <div>
          <div>
            {futureTasks.map((task) => {
              const isSelected = selectedTaskId === task.id

              return (
                <Link
                  key={task.id}
                  href={`?task=${task.id}`}
                  onClick={() => onTaskSelect(task.id)}
                  className={`flex items-center gap-2 py-2 pl-2 pr-2 transition-colors no-underline ${
                    isSelected
                      ? 'bg-primary dark:bg-[hsl(211,66%,43%)] border-b border-b-primary dark:border-b-[hsl(211,66%,53%)]'
                      : 'border-b border-border hover:bg-muted/50'
                  }`}
                >
                  {getStatusIcon(task.status, isSelected)}
                  <span className={`text-sm leading-tight flex-1 ${isSelected ? 'text-background dark:text-white' : 'text-primary dark:text-foreground'}`}>
                    {task.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

// ============================================================================
// MAIN EXPORT - Version Switcher
// ============================================================================

const TaskPanelComponent = (props: TaskPanelProps) => {
  if (TASK_PANEL_VERSION === 'future') {
    return <FutureTaskPanel {...props} />
  }
  return <CurrentTaskPanel {...props} />
}

export const TaskPanel = memo(TaskPanelComponent)
