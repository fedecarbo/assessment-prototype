'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockApplications } from '@/lib/mock-data/applications'
import { formatDate } from '@/lib/utils'

// Calculate days since submission and format as "X days received"
function formatDaysReceived(dateString: string): string {
  const submittedDate = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - submittedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${diffDays} days received`
}

// Format status for display
function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="blue" size="small">Pending</Badge>
    case 'under-review':
      return <Badge variant="yellow" size="small">Under review</Badge>
    case 'approved':
      return <Badge variant="green" size="small">Approved</Badge>
    case 'rejected':
      return <Badge variant="red" size="small">Rejected</Badge>
    default:
      return <Badge variant="gray" size="small">{status}</Badge>
  }
}

type TabId = 'assigned' | 'unassigned' | 'all' | 'updates' | 'closed'

export function PreApplicationsList() {
  const [activeTab, setActiveTab] = useState<TabId>('assigned')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter only pre-applications
  const preApplications = mockApplications.filter(app => app.type === 'pre-application')

  // Get current logged-in user (hardcoded for now)
  const currentUser = 'Federico Carbo'

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Calculate days since date for updates filter
  const getDaysSinceDate = (dateString: string): number => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Filter applications based on active tab
  const tabFilteredApplications = useMemo(() => {
    switch (activeTab) {
      case 'assigned':
        return preApplications.filter(app => app.assignedTo === currentUser)
      case 'unassigned':
        return preApplications.filter(app => !app.assignedTo)
      case 'all':
        return preApplications
      case 'updates':
        // Recent updates: submitted or status changed in last 7 days
        return preApplications.filter(app => getDaysSinceDate(app.submittedDate) <= 7)
      case 'closed':
        return preApplications.filter(app => app.status === 'approved' || app.status === 'rejected')
      default:
        return preApplications
    }
  }, [activeTab, preApplications, currentUser])

  // Apply search filter on top of tab filter
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) {
      return tabFilteredApplications
    }

    const query = searchQuery.toLowerCase()
    return tabFilteredApplications.filter(app =>
      app.reference.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query)
    )
  }, [tabFilteredApplications, searchQuery])

  // Calculate counts for each tab
  const counts = useMemo(() => ({
    assigned: preApplications.filter(app => app.assignedTo === currentUser).length,
    unassigned: preApplications.filter(app => !app.assignedTo).length,
    all: preApplications.length,
    updates: preApplications.filter(app => getDaysSinceDate(app.submittedDate) <= 7).length,
    closed: preApplications.filter(app => app.status === 'approved' || app.status === 'rejected').length,
  }), [preApplications, currentUser])

  const tabs = [
    { id: 'assigned' as TabId, label: 'Cases assigned to you', count: counts.assigned },
    { id: 'unassigned' as TabId, label: 'Unassigned cases', count: counts.unassigned },
    { id: 'all' as TabId, label: 'All cases', count: counts.all },
    { id: 'updates' as TabId, label: 'Updates', count: counts.updates },
    { id: 'closed' as TabId, label: 'Closed', count: counts.closed },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <nav role="tablist" aria-label="Pre-applications filters" className="mb-6 border-b">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
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
      </nav>

      {/* Applications Table */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {/* Search Section */}
        <div className="mb-6">
          <label htmlFor="search-applications" className="block text-lg font-bold mb-2">
            Find a pre-application
          </label>
          <p className="text-body text-muted-foreground mb-3">
            You can search by application number or description
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

        {filteredApplications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {searchQuery.trim() ? 'No applications found matching your search.' : 'No applications found in this category.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-bold text-foreground">Application number</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Site address</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Date received</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Days</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Link
                      href={`/application/${app.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {app.reference}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{app.address}</TableCell>
                  <TableCell className="text-sm">{formatDate(app.submittedDate)}</TableCell>
                  <TableCell>
                    <Badge variant="gray" size="small">{formatDaysReceived(app.submittedDate)}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
