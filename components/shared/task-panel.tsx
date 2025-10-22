import { memo } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { Check, Clock } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getStatusIcon(status: TaskStatus, isSelected: boolean) {
  // Completed: filled circle with checkmark
  if (status === 'completed') {
    if (isSelected) {
      return (
        <div className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-background dark:bg-foreground">
          <Check className="h-3.5 w-3.5 text-primary dark:text-background" strokeWidth={2.5} />
        </div>
      )
    }
    return (
      <div className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary dark:bg-foreground">
        <Check className="h-3.5 w-3.5 text-background dark:text-background" strokeWidth={2.5} />
      </div>
    )
  }

  // In progress: grey clock icon
  if (status === 'in-progress') {
    return (
      <Clock className={`h-5.5 w-5.5 flex-none ${isSelected ? 'text-background dark:text-white' : 'text-muted-foreground'}`} strokeWidth={1.5} />
    )
  }

  // Not started: dashed border (default grey or white when selected) - 1.5px thickness
  if (isSelected) {
    return (
      <div className="h-5 w-5 flex-none rounded-full border-[1.5px] border-dashed border-background dark:border-white" />
    )
  }
  return (
    <div className="h-5 w-5 flex-none rounded-full border-[1.5px] border-dashed border-muted-foreground" />
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
                    className={`flex items-center justify-between gap-3 py-2 pr-2 border-b border-border transition-colors no-underline ${
                      isSelected
                        ? 'bg-primary dark:bg-[hsl(211,66%,43%)] border-l-[3px] border-l-primary dark:border-l-[hsl(211,66%,43%)] pl-[7px]'
                        : 'pl-2 hover:bg-muted/50'
                    }`}
                  >
                    <span className={`text-base leading-tight ${isSelected ? 'text-background dark:text-white' : 'text-primary dark:text-foreground'}`}>
                      {task.title}
                    </span>
                    {getStatusIcon(task.status, isSelected)}
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
