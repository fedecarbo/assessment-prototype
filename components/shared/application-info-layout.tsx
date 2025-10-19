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

const tabs = [
  { id: 'overview' as TabId, label: 'Overview' },
  { id: 'documents' as TabId, label: 'Documents' },
  { id: 'constraints' as TabId, label: 'Constraints' },
  { id: 'site-history' as TabId, label: 'Site history' },
  { id: 'consultees' as TabId, label: 'Consultees' },
  { id: 'neighbours' as TabId, label: 'Neighbours' },
]

export function ApplicationInfoLayout({ application }: ApplicationInfoLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div>
      {/* Tabbed Navigation - Full width background with constrained content */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1100px] flex gap-6 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-[3px] py-3 text-base transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-primary hover:underline'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content - Constrained width */}
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        {activeTab === 'overview' && <ApplicationInfoOverview application={application} />}
        {activeTab === 'documents' && <ApplicationInfoDocuments application={application} />}
        {activeTab === 'constraints' && <ApplicationInfoConstraints application={application} />}
        {activeTab === 'site-history' && <ApplicationInfoSiteHistory application={application} />}
        {activeTab === 'consultees' && <ApplicationInfoConsultees application={application} />}
        {activeTab === 'neighbours' && <ApplicationInfoNeighbours application={application} />}
      </div>
    </div>
  )
}
