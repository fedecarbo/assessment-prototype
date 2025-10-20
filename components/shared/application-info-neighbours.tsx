'use client'

import { useState, useMemo } from 'react'
import type { Application, NeighbourResponse } from '@/lib/mock-data/schemas'
import { formatDate, truncateToWords, formatTopicLabel, RESPONSE_PREVIEW_WORD_LIMIT } from '@/lib/utils'

interface ApplicationInfoNeighboursProps {
  application: Application
}

type TabFilter = 'all' | 'support' | 'object' | 'neutral'

export function ApplicationInfoNeighbours({ application }: ApplicationInfoNeighboursProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  const neighbourData = application.neighbourConsultation

  if (!neighbourData) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Neighbours</h2>
          <p className="text-sm text-muted-foreground mt-1">Last updated: 13 October 2024</p>
        </div>
        <p className="text-sm text-muted-foreground">No neighbour consultation information available</p>
      </div>
    )
  }

  const filteredNeighbours = useMemo(
    () => (neighbourData.responses || []).filter((response) => {
      if (activeTab === 'all') return true
      return response.position === activeTab
    }),
    [neighbourData.responses, activeTab]
  )
  const tabs = [
    {
      id: 'all' as TabFilter,
      label: 'All',
      count: neighbourData.totalResponses
    },
    {
      id: 'support' as TabFilter,
      label: 'Support',
      count: neighbourData.supportCount
    },
    {
      id: 'object' as TabFilter,
      label: 'Object',
      count: neighbourData.objectCount
    },
    {
      id: 'neutral' as TabFilter,
      label: 'Neutral',
      count: neighbourData.neutralCount
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Neighbours</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 13 October 2024</p>
      </div>

      <div className="border-b border-border mb-6">
        <div className="flex gap-6" role="tablist" aria-label="Filter neighbours by position">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="neighbours-panel"
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

      <div id="neighbours-panel" role="tabpanel">
        {filteredNeighbours.length > 0 ? (
          <NeighboursTable neighbours={filteredNeighbours} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No neighbours match this filter
          </p>
        )}
      </div>
    </div>
  )
}

interface NeighboursTableProps {
  neighbours: NeighbourResponse[]
}

function NeighboursTable({ neighbours }: NeighboursTableProps) {
  return (
    <div className="space-y-3">
      {neighbours.map((neighbour) => (
        <NeighbourCard key={neighbour.id} neighbour={neighbour} />
      ))}
    </div>
  )
}

interface NeighbourCardProps {
  neighbour: NeighbourResponse
}

function NeighbourCard({ neighbour }: NeighbourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isLongResponse = useMemo(
    () => neighbour.summary ? neighbour.summary.split(' ').length > RESPONSE_PREVIEW_WORD_LIMIT : false,
    [neighbour.summary]
  )

  const displayText = isExpanded || !isLongResponse
    ? neighbour.summary
    : truncateToWords(neighbour.summary || '', RESPONSE_PREVIEW_WORD_LIMIT)

  return (
    <div className="border border-border rounded-md p-4 bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {neighbour.respondentName}
            </h3>
            <span className="text-sm text-muted-foreground">
              ({neighbour.address})
            </span>
          </div>
          {neighbour.responseDate && (
            <div className="text-xs text-muted-foreground">
              Response received {formatDate(neighbour.responseDate, 'short')}
            </div>
          )}
        </div>
        <PositionBadge position={neighbour.position} />
      </div>

      {neighbour.summary && (
        <div className="mb-3">
          <p className="text-base text-foreground leading-relaxed">
            {displayText}
          </p>
          {isLongResponse && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show less of response' : 'Show full response'}
              className="text-sm text-primary hover:underline underline-offset-2 mt-2"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {neighbour.topics && neighbour.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Response topics">
          {neighbour.topics.map((topic) => (
            <span
              key={topic}
              role="listitem"
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {formatTopicLabel(topic)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

interface PositionBadgeProps {
  position: 'support' | 'object' | 'neutral'
}

function PositionBadge({ position }: PositionBadgeProps) {
  const config = {
    'support': {
      label: 'Support',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    'object': {
      label: 'Object',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
    'neutral': {
      label: 'Neutral',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
  }

  const { label, className } = config[position]

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

