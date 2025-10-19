import type { Application } from '@/lib/mock-data/schemas'

interface ApplicationInfoDocumentsProps {
  application: Application
}

export function ApplicationInfoDocuments({ application }: ApplicationInfoDocumentsProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 15 October 2024</p>
      </div>
      <div className="min-h-[400px] border-2 border-dashed border-border bg-muted rounded p-8">
        <p className="text-sm text-muted-foreground">
          Documents content will be displayed here with detailed document listings, categories,
          and metadata for all submitted application materials.
        </p>
      </div>
    </div>
  )
}
