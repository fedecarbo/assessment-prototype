'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CaseSummaryHeaderProps {
  reference: string
  address: string
  description?: string
  variant?: 'default' | 'info'
  applicationId?: string
  constrained?: boolean
}

export function CaseSummaryHeader({ reference, address, description, variant = 'default', applicationId, constrained = false }: CaseSummaryHeaderProps) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className="border-b border-border bg-background">
      <div className={constrained ? "mx-auto max-w-[1100px] px-4 py-4" : "px-4 py-4"}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-foreground">{reference}</h1>
            <div className="h-4 w-px bg-border"></div>
            <h2 className="text-base text-foreground">{address}</h2>
            {description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-sm text-primary hover:underline"
                aria-expanded={showDescription}
                aria-controls="proposal-description"
              >
                {showDescription ? 'Hide' : 'Show'} proposal description
              </button>
            )}
          </div>
          {variant === 'default' && applicationId && (
            <Link
              href={`/application/${applicationId}/information`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-primary underline decoration-1 hover:decoration-2 transition-all"
              style={{ textUnderlineOffset: '0.1578em' }}
              aria-label={`View application information for ${reference}`}
            >
              Application information
            </Link>
          )}
        </div>

        {/* Expandable description */}
        {description && (
          <div
            id="proposal-description"
            role="region"
            aria-label="Proposal description"
            className={`overflow-hidden transition-all duration-300 ${
              showDescription ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
