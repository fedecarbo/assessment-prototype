'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet'
import type { Constraint } from '@/lib/mock-data/schemas'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  visibleConstraints: Set<string>
  constraints: Constraint[]
}

// Component to handle map bounds fitting
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [map, bounds])

  return null
}

export function MapView({ visibleConstraints, constraints }: MapViewProps) {
  // Default center for London (Southwark area)
  const center: [number, number] = [51.5074, -0.0901]

  // Example constraint boundaries (mock data - would come from actual constraint geometries)
  const constraintBounds: Record<string, [[number, number], [number, number]]> = {
    'conservation-1': [[51.508, -0.095], [51.510, -0.090]],
    'listed-1': [[51.506, -0.092], [51.507, -0.088]],
    'tpo-1': [[51.509, -0.093], [51.511, -0.089]],
    'flood-1': [[51.505, -0.096], [51.508, -0.091]],
  }

  // Color mapping for constraint types
  const constraintColors: Record<Constraint['type'], string> = {
    'conservation-area': '#4A90E2',
    'listed-building': '#E24A4A',
    'tpo': '#4AE290',
    'flood-risk': '#2A5BD7',
    'green-belt': '#90E24A',
    'article-4': '#E2904A',
    'archaeology': '#904AE2',
  }

  // Filter visible constraints
  const visibleConstraintsList = constraints.filter(c => visibleConstraints.has(c.id))

  return (
    <MapContainer
      center={center}
      zoom={18}
      style={{ height: '100%', width: '100%' }}
      className="rounded"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visibleConstraintsList.map((constraint) => {
        const bounds = constraintBounds[constraint.id]
        if (!bounds) return null

        const color = constraintColors[constraint.type]

        return (
          <Rectangle
            key={constraint.id}
            bounds={bounds}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        )
      })}
    </MapContainer>
  )
}
