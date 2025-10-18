'use client'

import { useState } from 'react'

interface ProposalDescriptionProps {
  description: string
  maxLines?: number
}

export function ProposalDescription({ description, maxLines = 3 }: ProposalDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Simple check: if description is longer than ~200 chars, enable read more
  const needsReadMore = description.length > 200

  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-foreground">Proposal description</h3>
      <div className="space-y-3">
        <p
          className={`text-base leading-relaxed text-foreground ${
            !isExpanded && needsReadMore ? 'line-clamp-3' : ''
          }`}
        >
          {description}
        </p>
        {needsReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-primary hover:text-foreground underline underline-offset-4 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}
