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
import { Check, Plus, CircleEllipsis, CircleDashed, CircleCheck, Lock } from 'lucide-react'
import Link from 'next/link'
import { getCurrentVersion } from './version-toggle'
import { Badge } from '@/components/ui/badge'
import { ACTION_ITEMS } from '@/lib/action-items'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
  applicationId?: string
  applicantRequestsCount?: number
  hasNewResponses?: boolean
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
      <Plus
        className={`h-[25px] w-[25px] flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`}
        strokeWidth={2}
        role="img"
        aria-label="Action item"
      />
    )
  }

  // Locked: Light grey filled square with dark grey filled padlock icon (minimal, disabled appearance)
  if (status === 'locked') {
    // Use light grey fill with no border, dark grey lock for contrast
    const backgroundColor = '#E5E7EB' // Light grey fill
    const lockColor = '#6B7280' // Dark grey lock for visibility

    return (
      <div
        className="relative h-[25px] w-[25px] flex-none flex items-center justify-center"
        style={{
          borderWidth: '1.5px',
          borderStyle: 'solid',
          borderColor: backgroundColor, // Border matches background for unified fill
          borderRadius: '4px',
          backgroundColor: backgroundColor
        }}
        role="img"
        aria-label="Locked - cannot start yet"
      >
        {/* Custom CSS-based filled padlock icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lock shackle (top arc) - outline only */}
          <path
            d="M7 10V7a5 5 0 0 1 10 0v3"
            stroke={lockColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lock body (filled rectangle) */}
          <rect
            x="4"
            y="10"
            width="16"
            height="11"
            rx="2"
            fill={lockColor}
          />
        </svg>
      </div>
    )
  }

  // Completed: Blue fill with white checkmark (white fill with blue checkmark when selected)
  if (status === 'completed') {
    return (
      <div
        className="relative flex h-[25px] w-[25px] flex-none items-center justify-center"
        style={{
          backgroundColor: isSelected ? '#ffffff' : '#1d70b8',
          border: isSelected ? '1.5px solid #ffffff' : '1.5px solid #1d70b8',
          borderRadius: '4px'
        }}
        role="img"
        aria-label="Completed"
      >
        <svg
          className="h-[16px] w-[16px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSelected ? '#1d70b8' : '#ffffff'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )
  }

  // In progress: Light blue square with dark navy arrow (active work, engaged state)
  if (status === 'in-progress') {
    const borderColor = isSelected ? '#ffffff' : '#b3d7f2' // Light blue border
    const arrowColor = isSelected ? '#ffffff' : '#0c2d4a' // Dark navy arrow (white when selected)
    const backgroundColor = isSelected ? '#1d70b8' : '#b3d7f2' // Light blue background (or dark blue when selected)

    return (
      <div
        className="relative flex h-[25px] w-[25px] flex-none items-center justify-center"
        style={{
          borderWidth: '1.5px',
          borderStyle: 'solid',
          borderColor: borderColor,
          borderRadius: '4px',
          backgroundColor: backgroundColor
        }}
        role="img"
        aria-label="In progress"
      >
        {/* Arrow pointing right */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke={isSelected ? '#ffffff' : arrowColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  // Needs review: Light yellow square with dark yellow exclamation mark (indicates updates/comments to review)
  if (status === 'needs-review') {
    // Using light yellow background with dark yellow icon
    const backgroundColor = isSelected ? '#f47738' : '#fff7bf' // Light yellow background
    const borderColor = isSelected ? '#ffffff' : '#fff7bf' // Light yellow border
    const iconColor = isSelected ? '#ffffff' : '#594d00' // Dark yellow exclamation

    return (
      <div
        className="relative flex h-[25px] w-[25px] flex-none items-center justify-center"
        style={{
          backgroundColor: backgroundColor,
          border: `1.5px solid ${borderColor}`,
          borderRadius: '4px'
        }}
        role="img"
        aria-label="Needs review - has updates"
      >
        {/* Exclamation mark */}
        <svg
          className="h-[20px] w-[20px]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Exclamation line */}
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="12.5"
            stroke={iconColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Exclamation dot */}
          <circle
            cx="12"
            cy="18"
            r="1.5"
            fill={iconColor}
          />
        </svg>
      </div>
    )
  }

  // Not started: Grey dashed square (minimal, waiting)
  return (
    <div
      className={`h-[25px] w-[25px] flex-none border-dashed ${
        isSelected ? 'border-background dark:border-white' : 'border-muted-foreground'
      }`}
      style={{ borderWidth: '1.5px', borderRadius: '4px' }}
      role="img"
      aria-label="Not started"
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
  applicantRequestsCount?: number
  hasNewResponses?: boolean
}

const BaseTaskPanel = ({ selectedTaskId, onTaskSelect, applicationId, tasks, groups, showNonLinearActions = false, previewButtonPlacement = 'top', applicantRequestsCount = 0, hasNewResponses = false }: BaseTaskPanelProps) => {
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
            {ACTION_ITEMS.map((actionItem) => {
              const isApplicantRequests = actionItem.id === 999
              const showBadge = isApplicantRequests && hasNewResponses

              return (
                <div key={actionItem.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={actionItem.href}
                    onClick={(e) => {
                      e.preventDefault()
                      onTaskSelect(actionItem.id)
                    }}
                    className="text-primary hover:underline"
                  >
                    {actionItem.label}
                    {/* Show count for applicant requests */}
                    {isApplicantRequests && applicantRequestsCount > 0 && ` (${applicantRequestsCount})`}
                    {/* Placeholder counts for other items - to be implemented */}
                    {actionItem.id === 996 && ' (1)'} {/* Meetings */}
                    {actionItem.id === 995 && ' (2)'} {/* Site visits */}
                    {actionItem.id === 994 && ' (5)'} {/* Notes */}
                  </Link>
                  {showBadge && <Badge variant="green" size="small">New</Badge>}
                </div>
              )
            })}
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
// CURRENT VERSION (Stable/Production) - Preview button at top, grouped tasks, non-linear actions
// ============================================================================

const CurrentTaskPanel = (props: TaskPanelProps) => {
  const { taskGroups } = useAssessment()
  return (
    <BaseTaskPanel
      {...props}
      groups={taskGroups}
      tasks={[]}
      showNonLinearActions={true}
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
