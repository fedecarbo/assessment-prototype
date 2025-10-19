'use client'

import { useAssessment } from './assessment-context'

export function AssessmentContent() {
  const { selectedTaskId } = useAssessment()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-foreground">Task item {selectedTaskId}</h1>
      <p className="mt-4 text-muted-foreground">
        Content for the selected task. Click different tasks in the left panel to switch content.
      </p>

      {/* Placeholder content to demonstrate scrolling */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="rounded border border-border bg-muted p-4">
            <h3 className="font-semibold">Section {i + 1} for Task {selectedTaskId}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is placeholder content for Task item {selectedTaskId}.
              The task panel on the left scrolls independently from this main content area.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
