'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PlanningApplication, ApplicantRequest } from '@/lib/mock-data/schemas'
import { getRequestStatusBadge } from '@/lib/task-utils'
import { formatDate } from '@/lib/utils'

interface ApplicantRequestsContentProps {
  application: PlanningApplication
}

export function ApplicantRequestsContent({ application }: ApplicantRequestsContentProps) {
  const requests = application.applicantRequests || []

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">Applicant requests</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Request additional information or documents from the applicant to support your assessment.
            Track all requests and responses in one place.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Content Area */}
      <div className="mt-6">
        {requests.length === 0 ? (
          // Empty state
          <div className="max-w-readable">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-center max-w-md mx-auto space-y-4">
                <div className="text-muted-foreground">
                  <p className="text-base">No applicant requests yet.</p>
                  <p className="text-sm mt-2">
                    Create your first request to ask the applicant for additional information or documents.
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/application/${application.id}/assessment/requests/new`}>
                    Create request
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Requests list
          <div className="space-y-[10px]">
            {/* Action button */}
            <div className="flex justify-start">
              <Button asChild>
                <Link href={`/application/${application.id}/assessment/requests/new`}>
                  Create request
                </Link>
              </Button>
            </div>

            {/* Requests table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base font-bold text-foreground pl-0 pr-3">Subject</TableHead>
                  <TableHead className="text-base font-bold text-foreground px-3">Sent</TableHead>
                  <TableHead className="text-base font-bold text-foreground px-3">Due</TableHead>
                  <TableHead className="text-base font-bold text-foreground pl-3 pr-0">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const hasUnreadResponse = request.response && !request.viewedByOfficer

                  return (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="py-[10px] pl-0 pr-3">
                        <div className="flex items-start gap-2">
                          <Link
                            href={`/application/${application.id}/assessment/requests/${request.id}`}
                            className="text-base text-primary hover:underline"
                          >
                            {request.subject}
                          </Link>
                          {hasUnreadResponse && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue text-white">
                              New
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-[10px] px-3 text-base">
                        {formatDate(request.sentDate)}
                      </TableCell>
                      <TableCell className="py-[10px] px-3 text-base">
                        {request.dueDate ? formatDate(request.dueDate) : '—'}
                      </TableCell>
                      <TableCell className="py-[10px] pl-3 pr-0">
                        {getRequestStatusBadge(request.status, request.dueDate)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
        </div>
        )}
      </div>
    </>
  )
}
