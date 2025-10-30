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
import { Check, Plus, CircleEllipsis, CircleDashed, CircleCheck } from 'lucide-react'
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
function getStatusIcon(status: TaskStatus | undefined, isSelected: boolean, taskId?: number) {
  // Action item (no status): + icon for items like "Manage application"
  if (!status) {
    return (
      <Plus className={`h-[25px] w-[25px] flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`} strokeWidth={2} />
    )
  }

  // Locked: CSS padlock icon (light grey)
  if (status === 'locked') {
    return (
      <div className="relative h-[25px] w-[25px] flex-none flex items-center justify-center">
        {/* Lock body (filled rectangle) */}
        <div
          className="absolute bottom-[3px] left-[5px] w-[15px] h-[12px] rounded-[2px]"
          style={{ backgroundColor: '#D1D5DB' }}
        />
        {/* Shackle (border-only arc on top) */}
        <div
          className="absolute top-[2px] left-[6.5px] w-[12px] h-[16px] rounded-t-[20px]"
          style={{
            borderTop: '2px solid #D1D5DB',
            borderLeft: '2px solid #D1D5DB',
            borderRight: '2px solid #D1D5DB',
            borderBottom: 'none'
          }}
        />
      </div>
    )
  }

  // Completed: Brand blue fill with white checkmark (white fill with blue checkmark when selected)
  if (status === 'completed') {
    return (
      <div
        className="relative flex h-[25px] w-[25px] flex-none items-center justify-center rounded-full"
        style={{
          backgroundColor: isSelected ? '#ffffff' : '#1d70b8',
          border: isSelected ? '1.5px solid #ffffff' : '1.5px solid #1d70b8'
        }}
      >
        <svg
          className="h-[14px] w-[14px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSelected ? '#1d70b8' : '#ffffff'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )
  }

  // In progress: Yellow fill with white horizontal line
  if (status === 'in-progress') {
    return (
      <div className="relative h-[25px] w-[25px] flex-none flex items-center justify-center">
        {/* Yellow filled circle */}
        <div
          className="h-[25px] w-[25px] rounded-full"
          style={{
            backgroundColor: '#ffbf47',
            border: '1.5px solid #ffbf47'
          }}
        />
        {/* White horizontal line inside */}
        <div
          className="absolute w-[10px] rounded-full"
          style={{
            height: '2px',
            backgroundColor: '#ffffff'
          }}
        />
      </div>
    )
  }

  // Not started: Grey dashed circle (original style)
  return (
    <div
      className={`h-[25px] w-[25px] flex-none rounded-full border-dashed ${
        isSelected ? 'border-background dark:border-white' : 'border-muted-foreground'
      }`}
      style={{ borderWidth: '1.5px' }}
    />
  )
}

// ============================================================================
// BASE TASK PANEL - Shared component to eliminate duplication
// ============================================================================

interface BaseTaskPanelProps extends TaskPanelProps {
  tasks: TaskPanelItem[]
  groups?: Array<{ title: string; tasks: TaskPanelItem[] }>
  showNonLinearActions?: boolean
  previewButtonPlacement?: 'top' | 'below-group-title'
}

const BaseTaskPanel = ({ selectedTaskId, onTaskSelect, applicationId, tasks, groups, showNonLinearActions = false, previewButtonPlacement = 'top' }: BaseTaskPanelProps) => {
  const renderTaskItem = (task: TaskPanelItem) => {
    const isSelected = selectedTaskId === task.id
    const isLocked = task.status === 'locked'

    return (
      <Link
        key={task.id}
        href={`?task=${task.id}`}
        onClick={(e) => {
          if (isLocked) {
            e.preventDefault()
          } else {
            onTaskSelect(task.id)
          }
        }}
        className={`flex items-center gap-[0.625rem] py-[0.625rem] pl-[0.625rem] pr-[0.625rem] transition-colors no-underline ${
          isLocked
            ? 'cursor-not-allowed border-b border-border'
            : isSelected
            ? 'bg-primary dark:bg-[hsl(211,66%,43%)] border-b border-b-primary dark:border-b-[hsl(211,66%,53%)]'
            : 'border-b border-border hover:bg-muted/50'
        }`}
      >
        {getStatusIcon(task.status, isSelected, task.id)}
        <span className={`text-sm leading-tight flex-1 ${
          isLocked
            ? 'text-muted-foreground/60'
            : isSelected
            ? 'text-background dark:text-white'
            : 'text-primary dark:text-foreground'
        }`}>
          {task.title}
        </span>
      </Link>
    )
  }

  return (
    <aside className="w-full md:w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-[1.25rem]">
      {/* Header */}
      <h2 className="text-lg font-bold text-foreground mb-[1.5rem]">Assessment</h2>

      {/* Non-linear actions - only shown in future version */}
      {showNonLinearActions && (
        <>
          <div className="space-y-[0.625rem]">
            <button className="block text-sm text-primary hover:underline" disabled>
              Activity
            </button>
            <button className="block text-sm text-primary hover:underline" disabled>
              Fees and services
            </button>
            <button className="block text-sm text-primary hover:underline" disabled>
              Meetings
            </button>
            <button className="block text-sm text-primary hover:underline" disabled>
              Site visits
            </button>
            <button className="block text-sm text-primary hover:underline" disabled>
              Notes
            </button>
          </div>

          {/* Divider separating non-linear actions from linear tasks */}
          <div className="border-b border-border my-[1.5rem]" />
        </>
      )}

      {/* Preview report button - shown at top level for current version */}
      {previewButtonPlacement === 'top' && (
        <div className="mb-[0.625rem]">
          <button
            className="text-sm text-primary hover:underline"
            disabled
          >
            Preview report (opens in new tab)
          </button>
        </div>
      )}

      {/* Render grouped or flat task list */}
      <div className="space-y-[1.5rem]">
        {groups ? (
          groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-sm text-foreground font-bold mb-[0.625rem]">
                {group.title}
              </h3>

              {/* Preview report button - appears below group title for future version */}
              {previewButtonPlacement === 'below-group-title' && (
                <div className="mb-[0.625rem]">
                  <button
                    className="text-sm text-primary hover:underline"
                    disabled
                  >
                    Preview report (opens in new tab)
                  </button>
                </div>
              )}

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
// CURRENT VERSION (Stable/Production) - Preview button at top, grouped tasks
// ============================================================================

const CurrentTaskPanel = (props: TaskPanelProps) => {
  const { taskGroups } = useAssessment()
  return (
    <BaseTaskPanel
      {...props}
      groups={taskGroups}
      tasks={[]}
      showNonLinearActions={false}
      previewButtonPlacement="top"
    />
  )
}

// ============================================================================
// FUTURE VERSION (Experimental/Development) - Non-linear actions + preview below group title
// ============================================================================

const FutureTaskPanel = (props: TaskPanelProps) => {
  const { futureTasks } = useFutureAssessment()

  // Wrap all tasks in a single group titled "Pre-application report"
  const futureGroups = [
    {
      title: 'Pre-application report',
      tasks: futureTasks
    }
  ]

  return (
    <BaseTaskPanel
      {...props}
      groups={futureGroups}
      tasks={[]}
      showNonLinearActions={true}
      previewButtonPlacement="below-group-title"
    />
  )
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
