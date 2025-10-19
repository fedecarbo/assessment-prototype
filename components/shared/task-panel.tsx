import { useAssessment, type TaskStatus } from './assessment-context'
import { Check, Circle, CircleDot } from 'lucide-react'

interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
    case 'in-progress':
      return <CircleDot className="h-4 w-4 text-blue-600 dark:text-blue-500" />
    case 'not-started':
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

export function TaskPanel({ selectedTaskId, onTaskSelect }: TaskPanelProps) {
  const { tasks } = useAssessment()

  return (
    <aside className="w-80 flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-base font-bold text-foreground">Tasks</h2>
      <div className="mt-4">
        <div className="space-y-2">
          {tasks.map((task) => {
            const isSelected = selectedTaskId === task.id

            return (
              <button
                key={task.id}
                onClick={() => onTaskSelect(task.id)}
                className={`w-full rounded border p-2 text-left text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                <span>{task.title}</span>
                {getStatusIcon(task.status)}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
