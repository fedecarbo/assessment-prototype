'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Application, Constraint } from '@/lib/mock-data/schemas'
import { Building2, Landmark, TreeDeciduous, Droplets, Trees, FileText, Castle, type LucideIcon } from 'lucide-react'

// Dynamically import MapView with SSR disabled to prevent Leaflet window errors during build
const MapView = dynamic(() => import('./map-view').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted rounded flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
})

interface ApplicationInfoConstraintsProps {
  application: Application
}

// Icon mapping for constraint types
const CONSTRAINT_ICONS: Record<Constraint['type'], LucideIcon> = {
  'conservation-area': Building2,
  'listed-building': Landmark,
  'tpo': TreeDeciduous,
  'flood-risk': Droplets,
  'green-belt': Trees,
  'article-4': FileText,
  'archaeology': Castle,
}

// Label mapping for constraint types
const CONSTRAINT_TYPE_LABELS: Record<Constraint['type'], string> = {
  'conservation-area': 'Conservation Area',
  'listed-building': 'Listed Building',
  'tpo': 'Tree Preservation Orders',
  'flood-risk': 'Flood Risk',
  'green-belt': 'Green Belt / MOL',
  'article-4': 'Article 4 Direction',
  'archaeology': 'Archaeological Priority Area',
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

  // Group constraints by type
  const groupedConstraints = constraints.reduce((acc, constraint) => {
    if (!acc[constraint.type]) {
      acc[constraint.type] = []
    }
    acc[constraint.type].push(constraint)
    return acc
  }, {} as Record<Constraint['type'], Constraint[]>)

  return (
    <div className="flex h-full">
      {constraints.length > 0 ? (
        <>
          {/* Map - Fills remaining width, max height to screen */}
          <div className="flex-1 overflow-hidden p-[30px]">
            <div className="h-full">
              <MapView visibleConstraints={visibleConstraints} constraints={constraints} />
            </div>
          </div>

          {/* Constraints Sidebar - Fixed width right, scrollable */}
          <div className="w-[370px] border-l border-border bg-card flex-shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">Constraints</h2>
              <p className="text-xs text-muted-foreground mt-1">Toggle to show/hide on map</p>
            </div>
            <div className="divide-y divide-border">
              {Object.entries(groupedConstraints).map(([type, groupConstraints]) => {
                const Icon = CONSTRAINT_ICONS[type as Constraint['type']]

                return (
                  <div key={type} className="py-4">
                    {/* Group Header */}
                    <div className="px-4 mb-3">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {CONSTRAINT_TYPE_LABELS[type as Constraint['type']]}
                        </span>
                      </div>
                    </div>

                    {/* Group Items */}
                    <div className="space-y-1 px-4">
                      {groupConstraints.map((constraint) => (
                        <label
                          key={constraint.id}
                          htmlFor={`constraint-${constraint.id}`}
                          className="flex items-start gap-3 py-2 px-2 -mx-2 rounded cursor-pointer hover:bg-muted/50 transition-colors group"
                        >
                          <input
                            type="checkbox"
                            id={`constraint-${constraint.id}`}
                            checked={visibleConstraints.has(constraint.id)}
                            onChange={() => handleToggleConstraint(constraint.id)}
                            className="mt-0.5 h-4 w-4 rounded border-border flex-shrink-0 cursor-pointer"
                            aria-label={`Show ${constraint.label} on map`}
                          />
                          <span className="text-sm text-foreground leading-tight flex-1">
                            {constraint.details || constraint.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center">
            <p className="text-sm text-muted-foreground">
              No constraints have been identified for this application.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
