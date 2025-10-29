'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Application } from '@/lib/mock-data/schemas'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

export function ApplicationInfoConstraints({ application }: ApplicationInfoConstraintsProps) {
  const constraints = application.constraints || []

  // Track which constraints are visible on the map (all visible by default)
  const [visibleConstraints, setVisibleConstraints] = useState<Set<string>>(
    () => new Set(constraints.map(c => c.id))
  )

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
        <p className="text-sm text-muted-foreground mt-1">Last updated: 20 October 2024</p>
      </div>

      {/* Map */}
      <div className="h-[600px] border border-border rounded overflow-hidden mb-8">
        <MapView visibleConstraints={visibleConstraints} constraints={constraints} />
      </div>

      {/* Constraints Table */}
      {constraints.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-base font-bold text-foreground">Show</TableHead>
              <TableHead className="w-16 text-base font-bold text-foreground"></TableHead>
              <TableHead className="text-base font-bold text-foreground">Constraint</TableHead>
              <TableHead className="text-base font-bold text-foreground">Entity</TableHead>
              <TableHead className="text-base font-bold text-foreground">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {constraints.map((constraint) => (
              <TableRow key={constraint.id}>
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    checked={visibleConstraints.has(constraint.id)}
                    onChange={() => handleToggleConstraint(constraint.id)}
                    className="h-4 w-4 rounded border-border cursor-pointer"
                    aria-label={`Toggle ${constraint.label} visibility`}
                  />
                </TableCell>
                <TableCell className="w-16">
                  <div
                    className="h-4 w-4 rounded-sm"
                    style={{
                      backgroundColor: constraint.color || '#4A90E2',
                    }}
                  />
                </TableCell>
                <TableCell className="text-base font-bold">
                  {constraint.label}
                </TableCell>
                <TableCell className="text-base">
                  {constraint.entity}
                </TableCell>
                <TableCell className="text-base">
                  {constraint.source || '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          No constraints have been identified for this application.
        </p>
      )}
    </div>
  )
}
