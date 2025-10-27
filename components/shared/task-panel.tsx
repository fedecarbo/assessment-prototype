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

import { memo, useState, useEffect } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { useFutureAssessment } from './future-assessment-context'
import { Check, Plus, CircleDot, CircleDashed } from 'lucide-react'
import Link from 'next/link'
import { getCurrentVersion } from './version-toggle'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
  applicationId?: string
}

// Type for items that can appear in task panel (tasks with status or action items without)
type TaskPanelItem = {
  id: number
  title: string
  status?: TaskStatus // undefined = action item (e.g., "Manage application")
}

// Extract status icon generator to avoid recreation on every render
function getStatusIcon(status: TaskStatus | undefined, isSelected: boolean) {
  // Action item (no status): + icon for items like "Manage application"
  if (!status) {
    return (
      <Plus className={`h-4 w-4 flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`} strokeWidth={2} />
    )
  }

  // Completed: Filled circle with checkmark
  if (status === 'completed') {
    if (isSelected) {
      return (
        <div className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-[1.5px] border-background dark:border-white bg-background dark:bg-white">
          <Check className="h-[15px] w-[15px] text-primary dark:text-[hsl(211,66%,43%)]" strokeWidth={2.5} />
        </div>
      )
    }
    return (
      <div className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-primary">
        <Check className="h-[15px] w-[15px] text-background" strokeWidth={2.5} />
      </div>
    )
  }

  // In progress: Circle with dot icon
  if (status === 'in-progress') {
    return (
      <CircleDot className={`h-[22px] w-[22px] flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`} strokeWidth={1.5} />
    )
  }

  // Not started: Dashed circle icon
  return (
    <CircleDashed className={`h-[22px] w-[22px] flex-none ${isSelected ? 'text-background dark:text-white' : 'text-muted-foreground'}`} strokeWidth={1.5} />
  )
}

// ============================================================================
// BASE TASK PANEL - Shared component to eliminate duplication
// ============================================================================

interface BaseTaskPanelProps extends TaskPanelProps {
  tasks: TaskPanelItem[]
  groups?: Array<{ title: string; tasks: TaskPanelItem[] }>
}

const BaseTaskPanel = ({ selectedTaskId, onTaskSelect, applicationId, tasks, groups }: BaseTaskPanelProps) => {
  const renderTaskItem = (task: TaskPanelItem) => {
    const isSelected = selectedTaskId === task.id

    return (
      <Link
        key={task.id}
        href={`?task=${task.id}`}
        onClick={() => onTaskSelect(task.id)}
        className={`flex items-center gap-[0.625rem] py-[0.625rem] pl-[0.625rem] pr-[0.625rem] transition-colors no-underline ${
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
  }

  return (
    <aside className="w-full md:w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-[1.25rem]">
      {/* Header */}
      <h2 className="text-lg font-bold text-foreground mb-[0.625rem]">Assessment</h2>

      {/* Preview report button */}
      <div className="mb-[1.5rem]">
        <button
          className="text-sm text-primary hover:underline"
          disabled
        >
          Preview report
        </button>
      </div>

      {/* Render grouped or flat task list */}
      <div className="space-y-[1.5rem]">
        {groups ? (
          groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-base text-muted-foreground font-normal mb-[0.625rem]">
                {group.title}
              </h3>
              <div className="space-y-0">
                {group.tasks.map(renderTaskItem)}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-0">
            {tasks.map(renderTaskItem)}
          </div>
        )}
      </div>
    </aside>
  )
}

// ============================================================================
// CURRENT VERSION (Stable/Production) - Grouped tasks
// ============================================================================

const CurrentTaskPanel = (props: TaskPanelProps) => {
  const { taskGroups } = useAssessment()
  return <BaseTaskPanel {...props} groups={taskGroups} tasks={[]} />
}

// ============================================================================
// FUTURE VERSION (Experimental/Development) - Flat task list
// ============================================================================

const FutureTaskPanel = (props: TaskPanelProps) => {
  const { futureTasks } = useFutureAssessment()
  return <BaseTaskPanel {...props} tasks={futureTasks} />
}

// ============================================================================
// MAIN EXPORT - Version Switcher
// ============================================================================

const TaskPanelComponent = (props: TaskPanelProps) => {
  const [version, setVersion] = useState<'current' | 'future'>(() => {
    // Initialize from environment variable on server-side
    return (process.env.NEXT_PUBLIC_TASK_PANEL_VERSION as 'current' | 'future') || 'current'
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // On client mount, check localStorage for user override
    setMounted(true)
    const clientVersion = getCurrentVersion()
    if (clientVersion !== version) {
      setVersion(clientVersion)
    }
  }, [version])

  // Prevent hydration mismatch by not rendering until mounted if versions differ
  if (!mounted && typeof window !== 'undefined') {
    // During SSR, always use env var version
    return version === 'future' ? <FutureTaskPanel {...props} /> : <CurrentTaskPanel {...props} />
  }

  return version === 'future' ? <FutureTaskPanel {...props} /> : <CurrentTaskPanel {...props} />
}

export const TaskPanel = memo(TaskPanelComponent)
