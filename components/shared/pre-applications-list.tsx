'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { mockApplications } from '@/lib/mock-data/applications'
import { formatDate } from '@/lib/utils'
import type { PlanningApplication } from '@/lib/mock-data/schemas'

// Calculate days since submission and format as "X days received"
function formatDaysReceived(dateString: string): string {
  const submittedDate = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - submittedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${diffDays} days received`
}

// Format status for display with new status values
function getStatusBadge(status: string) {
  switch (status) {
    case 'not-started':
      return <Badge variant="gray" size="small">Not started</Badge>
    case 'in-validation':
      return <Badge variant="light-blue" size="small">In validation</Badge>
    case 'in-assessment':
      return <Badge variant="yellow" size="small">In assessment</Badge>
    case 'in-review':
      return <Badge variant="purple" size="small">In review</Badge>
    case 'closed':
      return <Badge variant="green" size="small">Closed</Badge>
    case 'withdrawn':
      return <Badge variant="black" size="small">Withdrawn</Badge>
    default:
      return <Badge variant="gray" size="small">{status}</Badge>
  }
}

// Format outcome for display
function getOutcomeBadge(outcome: string) {
  switch (outcome) {
    case 'likely-supported':
      return <Badge variant="green" size="small">Likely to be supported</Badge>
    case 'likely-supported-with-changes':
      return <Badge variant="turquoise" size="small">Likely to be supported with changes</Badge>
    case 'unlikely-supported':
      return <Badge variant="red" size="small">Unlikely to be supported</Badge>
    default:
      return <Badge variant="gray" size="small">{outcome}</Badge>
  }
}

type TabId = 'assigned' | 'unassigned' | 'all' | 'closed'

// Standard table for active applications
function StandardApplicationsTable({ applications }: { applications: PlanningApplication[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-bold text-foreground pl-0 pr-3">Application number</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Site address</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Date received</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Days</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-3 pr-0">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="py-4 pl-0 pr-3">
              <Link
                href={`/application/${app.id}`}
                className="text-base font-medium text-primary hover:underline hover:text-foreground"
              >
                {app.reference}
              </Link>
            </TableCell>
            <TableCell className="py-4 px-3 text-base">{app.address}</TableCell>
            <TableCell className="py-4 px-3 text-base">{formatDate(app.submittedDate)}</TableCell>
            <TableCell className="py-4 px-3">
              <Badge variant="gray" size="small">{formatDaysReceived(app.submittedDate)}</Badge>
            </TableCell>
            <TableCell className="py-4 pl-3 pr-0">{getStatusBadge(app.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Closed table for completed applications with outcomes
function ClosedApplicationsTable({ applications }: { applications: PlanningApplication[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-bold text-foreground pl-0 pr-3">Application number</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Outcome</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Outcome date</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Site address</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-3 pr-0">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="py-4 pl-0 pr-3">
              <Link
                href={`/application/${app.id}`}
                className="text-base font-medium text-primary hover:underline hover:text-foreground"
              >
                {app.reference}
              </Link>
            </TableCell>
            <TableCell className="py-4 px-3">
              {app.outcome ? getOutcomeBadge(app.outcome) : <span className="text-base text-muted-foreground">—</span>}
            </TableCell>
            <TableCell className="py-4 px-3 text-base">
              {app.outcomeDate ? formatDate(app.outcomeDate) : <span className="text-muted-foreground">—</span>}
            </TableCell>
            <TableCell className="py-4 px-3 text-base">{app.address}</TableCell>
            <TableCell className="py-4 pl-3 pr-0 text-base">{app.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PreApplicationsList() {
  const [activeTab, setActiveTab] = useState<TabId>('assigned')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [outcomeFilters, setOutcomeFilters] = useState<string[]>([])

  // Filter only pre-applications
  const preApplications = mockApplications.filter(app => app.type === 'pre-application')

  // Get current logged-in user (hardcoded for now)
  const currentUser = 'Federico Carbo'

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Handle filter toggles
  const handleStatusFilterToggle = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handleOutcomeFilterToggle = (outcome: string) => {
    setOutcomeFilters(prev =>
      prev.includes(outcome)
        ? prev.filter(o => o !== outcome)
        : [...prev, outcome]
    )
  }

  // Filter applications based on active tab
  const tabFilteredApplications = useMemo(() => {
    switch (activeTab) {
      case 'assigned':
        // Show only active statuses (exclude closed and withdrawn)
        return preApplications.filter(app =>
          app.assignedTo === currentUser &&
          app.status !== 'closed' &&
          app.status !== 'withdrawn'
        )
      case 'unassigned':
        // Show only active statuses (exclude closed and withdrawn)
        return preApplications.filter(app =>
          !app.assignedTo &&
          app.status !== 'closed' &&
          app.status !== 'withdrawn'
        )
      case 'all':
        return preApplications
      case 'closed':
        return preApplications.filter(app => app.status === 'closed')
      default:
        return preApplications
    }
  }, [activeTab, preApplications, currentUser])

  // Apply search and additional filters on top of tab filter
  const filteredApplications = useMemo(() => {
    let filtered = tabFilteredApplications

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()

      // For closed tab, also search site address
      if (activeTab === 'closed') {
        filtered = filtered.filter(app =>
          app.reference.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.address.toLowerCase().includes(query)
        )
      } else {
        filtered = filtered.filter(app =>
          app.reference.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query)
        )
      }
    }

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(app => statusFilters.includes(app.status))
    }

    // Apply outcome filters
    if (outcomeFilters.length > 0) {
      filtered = filtered.filter(app => app.outcome && outcomeFilters.includes(app.outcome))
    }

    return filtered
  }, [tabFilteredApplications, searchQuery, activeTab, statusFilters, outcomeFilters])

  // Calculate counts for each tab
  const counts = useMemo(() => ({
    assigned: preApplications.filter(app =>
      app.assignedTo === currentUser &&
      app.status !== 'closed' &&
      app.status !== 'withdrawn'
    ).length,
    unassigned: preApplications.filter(app =>
      !app.assignedTo &&
      app.status !== 'closed' &&
      app.status !== 'withdrawn'
    ).length,
    all: preApplications.length,
    closed: preApplications.filter(app => app.status === 'closed').length,
  }), [preApplications, currentUser])

  const tabs = [
    { id: 'assigned' as TabId, label: 'Cases assigned to you', count: counts.assigned },
    { id: 'unassigned' as TabId, label: 'Unassigned cases', count: counts.unassigned },
    { id: 'all' as TabId, label: 'All cases', count: counts.all },
    { id: 'closed' as TabId, label: 'Closed', count: counts.closed },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation with GDS-style border connection */}
      <div className="border-b border-foreground">
        <nav role="tablist" aria-label="Pre-applications filters" className="flex gap-[0.3125rem]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-[1.25rem] text-base transition-colors ${
                activeTab === tab.id
                  ? 'border border-foreground border-b-0 -mb-px text-foreground font-medium bg-background'
                  : 'text-primary bg-muted mb-[0.3125rem] hover:text-foreground hover:underline decoration-primary underline-offset-[6px]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Applications Table with GDS-style bordered container */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="border border-t-0 border-foreground p-[1.25rem]"
      >
        {/* Search Section */}
        <div className="mb-6">
          <label htmlFor="search-applications" className="block text-lg font-bold mb-2">
            Find a pre-application
          </label>
          <p className="text-body text-muted-foreground mb-3">
            You can search by application number{activeTab === 'closed' ? ', site address,' : ''} or description
          </p>
          <div className="flex gap-3">
            <Input
              id="search-applications"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => {/* Search button - filter happens automatically via state */}}
            >
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearSearch}
            >
              Clear search
            </Button>
          </div>
        </div>

        {/* Filters Accordion */}
        <div className="mb-6 border border-foreground">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-[0.625rem] text-left bg-muted hover:bg-muted/80 transition-colors"
          >
            <span className="text-base font-medium">Filters</span>
            {showFilters ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {showFilters && (
            <div className="p-[1.25rem] border-t border-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filters */}
                <div>
                  <h3 className="text-base font-bold mb-3">Status</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'not-started', label: 'Not started' },
                      { value: 'in-validation', label: 'In validation' },
                      { value: 'in-assessment', label: 'In assessment' },
                      { value: 'in-review', label: 'In review' },
                      { value: 'closed', label: 'Closed' },
                      { value: 'withdrawn', label: 'Withdrawn' },
                    ].map((status) => (
                      <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={statusFilters.includes(status.value)}
                          onCheckedChange={() => handleStatusFilterToggle(status.value)}
                        />
                        <span className="text-base">{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Outcome Filters */}
                <div>
                  <h3 className="text-base font-bold mb-3">Outcome</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'likely-supported', label: 'Likely to be supported' },
                      { value: 'likely-supported-with-changes', label: 'Likely to be supported with changes' },
                      { value: 'unlikely-supported', label: 'Unlikely to be supported' },
                    ].map((outcome) => (
                      <label key={outcome.value} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={outcomeFilters.includes(outcome.value)}
                          onCheckedChange={() => handleOutcomeFilterToggle(outcome.value)}
                        />
                        <span className="text-base">{outcome.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {searchQuery.trim() ? 'No applications found matching your search.' : 'No applications found in this category.'}
          </div>
        ) : activeTab === 'closed' ? (
          <ClosedApplicationsTable applications={filteredApplications} />
        ) : (
          <StandardApplicationsTable applications={filteredApplications} />
        )}
      </div>
    </div>
  )
}
