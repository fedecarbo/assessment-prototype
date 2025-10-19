import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoConstraintsProps {
  application: Application
}

export function ApplicationInfoConstraints({ application }: ApplicationInfoConstraintsProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Constraints</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 10 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Constraints content will be displayed here with detailed constraint information, impacts,
          and planning policy considerations for the application site.
        </p>
      </div>
    </div>
  )
}
