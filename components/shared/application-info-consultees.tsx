import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoConsulteesProps {
  application: Application
}

export function ApplicationInfoConsultees({ application }: ApplicationInfoConsulteesProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Consultees</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 14 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Consultees content will be displayed here with detailed statutory consultee information,
          consultation responses, and recommended conditions or requirements.
        </p>
      </div>
    </div>
  )
}
