import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoOverviewProps {
  application: Application
}

export function ApplicationInfoOverview({ application }: ApplicationInfoOverviewProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 12 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Overview content will be displayed here with granular application details, including proposal description,
          application type, requested services, and metadata.
        </p>
      </div>
    </div>
  )
}
