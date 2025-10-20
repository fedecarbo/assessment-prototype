'use client'

import { useState } from 'react'
import type { Application } from '@/lib/mock-data/schemas'
import { ApplicationInfoOverview } from './application-info-overview'
import { ApplicationInfoDocuments } from './application-info-documents'
import { ApplicationInfoConstraints } from './application-info-constraints'
import { ApplicationInfoSiteHistory } from './application-info-site-history'
import { ApplicationInfoConsultees } from './application-info-consultees'
import { ApplicationInfoNeighbours } from './application-info-neighbours'

interface ApplicationInfoLayoutProps {
  application: Application
}

type TabId = 'overview' | 'documents' | 'constraints' | 'site-history' | 'consultees' | 'neighbours'

export function ApplicationInfoLayout({ application }: ApplicationInfoLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const consulteeCount = application.consulteeConsultation?.totalConsultees || 0
  const neighbourCount = application.neighbourConsultation?.totalResponses || 0
  const documentCount = application.documents?.length || 0
  const constraintCount = application.constraints?.filter(c => c.status !== 'does-not-apply').length || 0

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', count: undefined },
    { id: 'documents' as TabId, label: 'Documents', count: documentCount },
    { id: 'constraints' as TabId, label: 'Constraints', count: constraintCount },
    { id: 'consultees' as TabId, label: 'Consultees', count: consulteeCount },
    { id: 'neighbours' as TabId, label: 'Neighbours', count: neighbourCount },
    { id: 'site-history' as TabId, label: 'Site history', count: undefined },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tabbed Navigation - Full width background with constrained content */}
      <nav className="border-b border-border bg-background flex-shrink-0">
        <div className="mx-auto max-w-[1100px] flex gap-6 px-4" role="tablist" aria-label="Application information sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="application-info-panel"
              className={`border-b-[3px] py-3 text-base transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-primary hover:underline'
              }`}
            >
              {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content - Full width for Constraints, constrained for others */}
      <div
        id="application-info-panel"
        role="tabpanel"
        className={
          activeTab === 'constraints'
            ? 'flex-1 overflow-hidden'
            : 'flex-1 overflow-y-auto'
        }
      >
        {activeTab === 'overview' && (
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <ApplicationInfoOverview application={application} />
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <ApplicationInfoDocuments application={application} />
          </div>
        )}
        {activeTab === 'constraints' && <ApplicationInfoConstraints application={application} />}
        {activeTab === 'site-history' && (
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <ApplicationInfoSiteHistory application={application} />
          </div>
        )}
        {activeTab === 'consultees' && (
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <ApplicationInfoConsultees application={application} />
          </div>
        )}
        {activeTab === 'neighbours' && (
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <ApplicationInfoNeighbours application={application} />
          </div>
        )}
      </div>
    </div>
  )
}
