interface TaskPanelProps {
  selectedTaskId: number
  onTaskSelect: (taskId: number) => void
}

export function TaskPanel({ selectedTaskId, onTaskSelect }: TaskPanelProps) {
  return (
    <aside className="w-80 flex-none overflow-y-auto border-r border-border bg-background p-4">
      <h2 className="text-base font-bold text-foreground">Tasks</h2>
      <div className="mt-4">
        {/* Add some placeholder content to demonstrate scrolling */}
        <div className="space-y-2">
          {Array.from({ length: 50 }, (_, i) => {
            const taskId = i + 1
            const isSelected = selectedTaskId === taskId

            return (
              <button
                key={i}
                onClick={() => onTaskSelect(taskId)}
                className={`w-full rounded border p-2 text-left text-xs transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                Task item {taskId}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
