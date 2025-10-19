'use client'

import { useState } from 'react'
import type { Document } from '@/lib/mock-data/schemas'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface DocumentListProps {
  documents?: Document[]
}

const DOCUMENT_CATEGORIES = ['drawings', 'supporting', 'evidence'] as const
type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]

const categoryLabels: Record<DocumentCategory, string> = {
  drawings: 'Drawings',
  supporting: 'Supporting documents',
  evidence: 'Evidence',
} as const

type ExpandedState = Record<DocumentCategory, boolean>

export function DocumentList({ documents }: DocumentListProps) {
  const [expandedCategories, setExpandedCategories] = useState<ExpandedState>({
    drawings: true,
    supporting: false,
    evidence: false,
  })

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

  const toggleCategory = (category: DocumentCategory) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="space-y-5">
      {DOCUMENT_CATEGORIES.map((category) => {
        const categoryDocs = groupedDocuments[category]
        if (!categoryDocs || categoryDocs.length === 0) return null

        const isExpanded = expandedCategories[category]
        const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

        return (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 mb-3 text-base font-semibold text-foreground hover:text-primary transition-colors w-full text-left"
            >
              <ChevronIcon className="h-5 w-5 flex-shrink-0" />
              <span>
                {categoryLabels[category]} ({categoryDocs.length})
              </span>
            </button>

            {isExpanded && (
              <div className="space-y-0 ml-7">
                {categoryDocs.map((doc, index) => {
                  const isLast = index === categoryDocs.length - 1

                  return (
                    <div
                      key={doc.id}
                      className={`flex gap-3 py-3 ${!isLast ? 'border-b border-border' : ''}`}
                    >
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-16 bg-muted border border-border" />

                      {/* Document info */}
                      <div className="flex-1 min-w-0">
                        <a
                          href="#"
                          className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors inline-block mb-1.5"
                        >
                          {doc.name}
                        </a>

                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {doc.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="gray" size="small">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
