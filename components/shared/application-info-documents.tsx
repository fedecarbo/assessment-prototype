'use client'

import { useState } from 'react'
import type { Application } from '@/lib/mock-data/schemas'
import { DocumentsTable } from './documents-table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface ApplicationInfoDocumentsProps {
  application: Application
}

export function ApplicationInfoDocuments({ application }: ApplicationInfoDocumentsProps) {
  const documents = application.documents || []
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all')

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    const matchesVisibility = visibilityFilter === 'all' || doc.visibility === visibilityFilter

    return matchesSearch && matchesCategory && matchesVisibility
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 15 October 2024</p>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="drawings">Drawings</SelectItem>
                <SelectItem value="supporting">Supporting</SelectItem>
                <SelectItem value="evidence">Evidence</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All visibility</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="sensitive">Sensitive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {filteredDocuments.length > 0 ? (
            <DocumentsTable documents={filteredDocuments} />
          ) : (
            <div className="min-h-[200px] border-2 border-dashed border-border bg-muted rounded p-8 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No documents match your search criteria.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[200px] border-2 border-dashed border-border bg-muted rounded p-8">
          <p className="text-sm text-muted-foreground">
            No documents have been submitted for this application.
          </p>
        </div>
      )}
    </div>
  )
}
