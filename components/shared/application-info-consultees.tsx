'use client'

import { useState } from 'react'
import type { Application, ConsulteeResponse, ConsulteePosition } from '@/lib/mock-data/schemas'

interface ApplicationInfoConsulteesProps {
  application: Application
}

type TabFilter = 'all' | 'no-objection' | 'amendments-needed' | 'objection'

export function ApplicationInfoConsultees({ application }: ApplicationInfoConsulteesProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  const consulteeData = application.consulteeConsultation

  if (!consulteeData) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Consultees</h2>
          <p className="text-sm text-muted-foreground mt-1">Last updated: 14 October 2024</p>
        </div>
        <p className="text-sm text-muted-foreground">No consultee information available</p>
      </div>
    )
  }

  // Filter consultees based on active tab
  const filteredConsultees = consulteeData.responses.filter((response) => {
    if (activeTab === 'all') return true
    return response.position === activeTab
  })

  // Tab configuration with counts
  const tabs = [
    {
      id: 'all' as TabFilter,
      label: 'All',
      count: consulteeData.totalConsultees
    },
    {
      id: 'no-objection' as TabFilter,
      label: 'No objection',
      count: consulteeData.noObjectionCount
    },
    {
      id: 'amendments-needed' as TabFilter,
      label: 'Amendments needed',
      count: consulteeData.amendmentsNeededCount
    },
    {
      id: 'objection' as TabFilter,
      label: 'Objected',
      count: consulteeData.objectionCount
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Consultees</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 14 October 2024</p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-base border-b-[3px] transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-primary hover:text-foreground hover:underline decoration-primary underline-offset-[6px]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Consultees table */}
      {filteredConsultees.length > 0 ? (
        <ConsulteesTable consultees={filteredConsultees} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No consultees match this filter
        </p>
      )}
    </div>
  )
}

interface ConsulteesTableProps {
  consultees: ConsulteeResponse[]
}

function ConsulteesTable({ consultees }: ConsulteesTableProps) {
  return (
    <div className="space-y-3">
      {consultees.map((consultee) => (
        <ConsulteeCard key={consultee.id} consultee={consultee} />
      ))}
    </div>
  )
}

interface ConsulteeCardProps {
  consultee: ConsulteeResponse
}

function ConsulteeCard({ consultee }: ConsulteeCardProps) {
  return (
    <div className="border border-border rounded-md p-4 bg-card hover:bg-muted/50 transition-colors">
      {/* Header: Organisation name and position badge */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {consultee.consulteeOrg}
            </h3>
            <span className="text-sm text-muted-foreground">
              ({consultee.type === 'internal' ? 'Internal' : 'External'})
            </span>
          </div>
          {/* Last response date below name */}
          {consultee.responseDate && (
            <div className="text-xs text-muted-foreground">
              Last response {formatDate(consultee.responseDate)}
            </div>
          )}
        </div>
        <PositionBadge position={consultee.position} />
      </div>

      {/* Summary text */}
      {consultee.summary && (
        <p className="text-base text-foreground mb-3 leading-relaxed">
          {consultee.summary}
        </p>
      )}

      {/* View comments link */}
      <div className="pt-2 border-t border-border">
        <button className="text-sm text-primary hover:underline underline-offset-2">
          View comments ({consultee.commentCount})
        </button>
      </div>
    </div>
  )
}

interface PositionBadgeProps {
  position: ConsulteePosition
}

function PositionBadge({ position }: PositionBadgeProps) {
  const config = {
    'no-objection': {
      label: 'No objection',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    'objection': {
      label: 'Objection',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
    'amendments-needed': {
      label: 'Amendments needed',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    'not-contacted': {
      label: 'Not contacted',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
    'awaiting-response': {
      label: 'Awaiting response',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
  }

  const { label, className } = config[position]

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
