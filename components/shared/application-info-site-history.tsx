import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoSiteHistoryProps {
  application: Application
}

export function ApplicationInfoSiteHistory({ application }: ApplicationInfoSiteHistoryProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Site history</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 8 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Site history and previous planning applications will be displayed here.
        </p>
      </div>
    </div>
  )
}
