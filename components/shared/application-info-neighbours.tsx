import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoNeighboursProps {
  application: Application
}

export function ApplicationInfoNeighbours({ application }: ApplicationInfoNeighboursProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Neighbours</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 13 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Neighbours content will be displayed here with detailed neighbour consultation information,
          responses, objections, and support comments from local residents.
        </p>
      </div>
    </div>
  )
}
