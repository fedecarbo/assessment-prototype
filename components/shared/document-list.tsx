import { FileText, Image, File } from 'lucide-react'
import type { Document } from '@/lib/mock-data/schemas'

interface DocumentListProps {
  documents?: Document[]
}

const categoryLabels = {
  drawings: 'Drawings',
  supporting: 'Supporting documents',
  evidence: 'Evidence',
} as const

function getFileIcon(fileType: Document['fileType']) {
  if (fileType === 'jpg' || fileType === 'png') {
    return Image
  }
  if (fileType === 'pdf') {
    return FileText
  }
  return File
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function DocumentList({ documents }: DocumentListProps) {
  if (!documents || documents.length === 0) {
    return (
      <p className="text-base text-muted-foreground">No documents uploaded yet</p>
    )
  }

  // Group documents by category
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = []
      }
      acc[doc.category].push(doc)
      return acc
    },
    {} as Record<Document['category'], Document[]>
  )

  return (
    <div className="space-y-8">
      {(['drawings', 'supporting', 'evidence'] as const).map((category) => {
        const categoryDocs = groupedDocuments[category]
        if (!categoryDocs || categoryDocs.length === 0) return null

        return (
          <div key={category}>
            <h3 className="mb-4 text-base font-semibold text-foreground">
              {categoryLabels[category]}
            </h3>
            <div className="space-y-0">
              {categoryDocs.map((doc, index) => {
                const Icon = getFileIcon(doc.fileType)
                const isLast = index === categoryDocs.length - 1

                return (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-3 py-4 ${!isLast ? 'border-b border-border' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h4 className="text-base font-medium text-foreground">
                          {doc.name}
                        </h4>
                        <button className="flex-shrink-0 text-sm text-primary hover:text-foreground hover:underline transition-colors">
                          Download
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span>{doc.fileType.toUpperCase()}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.uploadedDate)}</span>
                        <span>•</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
