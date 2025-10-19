import { useAssessment, type TaskStatus } from './assessment-context'
import { Check, Circle, CircleDot } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return <Check className="h-4 w-4 text-foreground" />
    case 'in-progress':
      return <CircleDot className="h-4 w-4 text-blue-600 dark:text-blue-500" />
    case 'not-started':
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

export function TaskPanel({ selectedTaskId, onTaskSelect }: TaskPanelProps) {
  const { taskGroups } = useAssessment()

  return (
    <aside className="w-[338px] flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-base font-bold text-foreground mb-5">Tasks</h2>
      <div className="space-y-0">
        {taskGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-sm font-bold text-foreground mb-2.5">{group.title}</h3>
            <div className="space-y-0">
              {group.tasks.map((task, taskIndex) => {
                const isSelected = selectedTaskId === task.id

                return (
                  <div key={task.id}>
                    <Link
                      href={`?task=${task.id}`}
                      onClick={() => onTaskSelect(task.id)}
                      className={`flex items-center justify-between py-1.5 text-sm transition-colors ${
                        isSelected
                          ? 'text-foreground font-semibold no-underline'
                          : 'text-primary hover:text-foreground underline underline-offset-[3px]'
                      }`}
                    >
                      <span>{task.title}</span>
                      {getStatusIcon(task.status)}
                    </Link>
                    {taskIndex < group.tasks.length - 1 && <Separator className="my-1" />}
                  </div>
                )
              })}
            </div>
            {groupIndex < taskGroups.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </aside>
  )
}
