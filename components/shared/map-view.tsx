'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet'
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
  propertyBoundary?: {
    type: 'Polygon'
    coordinates: [number, number][][]
  }
  showPropertyBoundary?: boolean
  center?: [number, number]
}

export function MapView({
  visibleConstraints,
  constraints,
  propertyBoundary,
  showPropertyBoundary = true,
  center: customCenter
}: MapViewProps) {
  // Center on custom center, or default to Bermondsey Street, London
  const center: [number, number] = customCenter || [51.501, -0.084]

  // Filter visible constraints
  const visibleConstraintsList = constraints.filter(c => visibleConstraints.has(c.id))

  // Convert property boundary coordinates to Leaflet format if available
  const propertyBoundaryPositions = propertyBoundary && showPropertyBoundary
    ? propertyBoundary.coordinates[0]?.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      ) ?? []
    : []

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
        if (!constraint.geometry) return null

        const color = constraint.color || '#4A90E2'

        // Handle Point geometry (e.g., listed buildings)
        if (constraint.geometry.type === 'Point') {
          const [lng, lat] = constraint.geometry.coordinates
          return (
            <Marker key={constraint.id} position={[lat, lng]}>
              <Popup>
                <div>
                  <strong>{constraint.entity}</strong>
                  <br />
                  {constraint.label}
                  {constraint.value && (
                    <>
                      <br />
                      <em>{constraint.value}</em>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        }

        // Handle Polygon geometry
        if (constraint.geometry.type === 'Polygon') {
          const positions = constraint.geometry.coordinates[0]?.map(
            ([lng, lat]) => [lat, lng] as [number, number]
          ) ?? []
          return (
            <Polygon
              key={constraint.id}
              positions={positions}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <div>
                  <strong>{constraint.entity}</strong>
                  <br />
                  {constraint.label}
                </div>
              </Popup>
            </Polygon>
          )
        }

        // Handle MultiPolygon geometry
        if (constraint.geometry.type === 'MultiPolygon') {
          return constraint.geometry.coordinates.map((polygon, idx) => {
            const positions = polygon[0]?.map(
              ([lng, lat]) => [lat, lng] as [number, number]
            ) ?? []
            return (
              <Polygon
                key={`${constraint.id}-${idx}`}
                positions={positions}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              >
                <Popup>
                  <div>
                    <strong>{constraint.entity}</strong>
                    <br />
                    {constraint.label}
                  </div>
                </Popup>
              </Polygon>
            )
          })
        }

        return null
      })}

      {/* Property Boundary - Red dashed outline */}
      {propertyBoundaryPositions.length > 0 && (
        <Polygon
          positions={propertyBoundaryPositions}
          pathOptions={{
            color: '#E53E3E',        // Red outline
            fillColor: '#E53E3E',
            fillOpacity: 0.1,        // Light transparent fill
            weight: 3,               // 3px stroke
            dashArray: '5, 5'        // Dashed line pattern
          }}
        >
          <Popup>
            <div>
              <strong>Property Boundary</strong>
            </div>
          </Popup>
        </Polygon>
      )}
    </MapContainer>
  )
}
