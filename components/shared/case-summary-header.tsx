'use client'

import { useState } from 'react'

interface CaseSummaryHeaderProps {
  reference: string
  address: string
  description?: string
}

export function CaseSummaryHeader({ reference, address, description }: CaseSummaryHeaderProps) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className="border-b border-border bg-background">
      <div className="px-4 py-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-base font-bold text-foreground">{reference}</h1>
            <h2 className="text-base text-foreground">{address}</h2>
            {description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-sm text-primary hover:underline"
              >
                {showDescription ? 'Hide' : 'Show'} proposal description
              </button>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-primary hover:underline">
              Application information
            </a>
            <a href="#" className="text-primary hover:underline">
              Documents
            </a>
          </div>
        </div>

        {/* Expandable description */}
        {description && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showDescription ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded border border-border bg-muted p-4 max-w-4xl">
              <p className="text-sm text-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
