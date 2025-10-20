import { memo } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { Check } from 'lucide-react'
import Link from 'next/link'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getCheckbox(status: TaskStatus, isSelected: boolean) {
  if (status === 'completed') {
    return (
      <div className="flex h-4 w-4 flex-none items-center justify-center rounded-sm border-2 border-foreground bg-foreground">
        <Check className="h-3 w-3 text-background" strokeWidth={3} />
      </div>
    )
  }

  if (status === 'in-progress') {
    return (
      <div className="flex h-4 w-4 flex-none items-center justify-center rounded-sm border-2 border-primary bg-background">
        <div className="h-1.5 w-1.5 rounded-sm bg-primary" />
      </div>
    )
  }

  return (
    <div className={`h-4 w-4 flex-none rounded-sm border-2 ${
      isSelected ? 'border-foreground' : 'border-muted-foreground'
    }`} />
  )
}

const TaskPanelComponent = ({ selectedTaskId, onTaskSelect }: TaskPanelProps) => {
  const { taskGroups } = useAssessment()

  return (
    <aside className="w-task-panel flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-xl font-bold text-foreground mb-6">Tasks</h2>
      <div className="space-y-6">
        {taskGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-sm font-bold text-foreground mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.tasks.map((task) => {
                const isSelected = selectedTaskId === task.id
                const isCompleted = task.status === 'completed'

                return (
                  <Link
                    key={task.id}
                    href={`?task=${task.id}`}
                    onClick={() => onTaskSelect(task.id)}
                    className={`flex items-center justify-between gap-3 rounded-md p-1.5 transition-colors no-underline ${
                      isSelected
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className={`text-sm leading-tight ${
                      isCompleted
                        ? 'text-muted-foreground'
                        : isSelected
                        ? 'text-foreground font-medium'
                        : 'text-foreground'
                    }`}>
                      {task.title}
                    </span>
                    {getCheckbox(task.status, isSelected)}
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
