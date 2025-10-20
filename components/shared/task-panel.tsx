import { memo } from 'react'
import { useAssessment, type TaskStatus } from './assessment-context'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getCheckbox(status: TaskStatus, isSelected: boolean) {
  if (status === 'completed') {
    return (
      <div className={`flex h-5 w-5 flex-none items-center justify-center rounded-sm ${
        isSelected ? 'bg-white/20' : 'bg-muted-foreground/25'
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
      isSelected ? 'bg-white/20' : 'bg-muted-foreground/25'
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
                        : 'text-primary hover:underline'
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

export const TaskPanel = memo(TaskPanelComponent)
