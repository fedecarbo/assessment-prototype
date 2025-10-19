'use client'

import { useState } from 'react'
import type { Application } from '@/lib/mock-data/schemas'
import { ConstraintsTable } from './constraints-table'

interface ApplicationInfoConstraintsProps {
  application: Application
}

export function ApplicationInfoConstraints({ application }: ApplicationInfoConstraintsProps) {
  const constraints = application.constraints || []

  // Track which constraints are visible on the map (initially all are visible)
  const [visibleConstraints, setVisibleConstraints] = useState<Set<string>>(
    () => new Set(constraints.map(c => c.id))
  )

  // Toggle constraint visibility
  const handleToggleConstraint = (constraintId: string) => {
    setVisibleConstraints(prev => {
      const newSet = new Set(prev)
      if (newSet.has(constraintId)) {
        newSet.delete(constraintId)
      } else {
        newSet.add(constraintId)
      }
      return newSet
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Constraints</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 10 October 2024</p>
      </div>

      {constraints.length > 0 ? (
        <div className="space-y-4">
          {/* Map - Full width */}
          <div className="w-full">
            <div className="h-[400px] bg-muted border border-border rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Interactive constraints map placeholder</p>
            </div>
          </div>

          {/* Table - Full width */}
          <ConstraintsTable
            constraints={constraints}
            visibleConstraints={visibleConstraints}
            onToggleConstraint={handleToggleConstraint}
          />
        </div>
      ) : (
        <div className="min-h-[200px] border-2 border-dashed border-border bg-muted rounded p-8">
          <p className="text-sm text-muted-foreground">
            No constraints have been identified for this application.
          </p>
        </div>
      )}
    </div>
  )
}
