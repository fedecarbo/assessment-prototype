import { memo } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { Check, Plus } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getStatusIcon(status: TaskStatus | undefined, isSelected: boolean, taskId?: number) {
  // No status: + icon (for action items like "Add new service")
  if (!status) {
    return (
      <Plus className={`h-4 w-4 flex-none ${isSelected ? 'text-background dark:text-white' : 'text-primary'}`} strokeWidth={2} />
    )
  }

  // Completed: Filled circle with checkmark
  // Alternative donut style (if reverting):
  // <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-primary relative flex items-center justify-center">
  //   <div className="h-[14px] w-[14px] rounded-full bg-primary" />
  // </div>
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
  // Alternative with half-fill (if reverting):
  // <div className="h-4 w-4 flex-none rounded-full border-[1.5px] border-primary relative flex items-center justify-center">
  //   <div className="h-[14px] w-[14px] rounded-full overflow-hidden relative">
  //     <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-primary" />
  //   </div>
  // </div>
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

const TaskPanelComponent = ({ selectedTaskId, onTaskSelect }: TaskPanelProps) => {
  const { taskGroups } = useAssessment()

  return (
    <aside className="w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-lg font-bold text-foreground mb-6">Assessment tasks</h2>
      <div className="space-y-6">
        {taskGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-base font-bold text-foreground mb-2">
              {group.title}
            </h3>
            <div>
              {group.tasks.map((task) => {
                const isSelected = selectedTaskId === task.id
                const isCompleted = task.status === 'completed'

                return (
                  <Link
                    key={task.id}
                    href={`?task=${task.id}`}
                    onClick={() => onTaskSelect(task.id)}
                    className={`flex items-center gap-2 py-2 pr-2 transition-colors no-underline ${
                      isSelected
                        ? 'bg-primary dark:bg-[hsl(211,66%,43%)] border-l-[3px] border-l-primary dark:border-l-[hsl(211,66%,43%)] border-b border-b-primary pl-[7px]'
                        : 'pl-2 border-b border-border hover:bg-muted/50'
                    }`}
                  >
                    {getStatusIcon(task.status, isSelected, task.id)}
                    <span className={`text-sm leading-tight ${isSelected ? 'text-background dark:text-white' : 'text-primary dark:text-foreground'}`}>
                      {task.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export const TaskPanel = memo(TaskPanelComponent)
