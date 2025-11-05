'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import type { PlanningApplication, ApplicantRequest } from '@/lib/mock-data/schemas'
import { getRequestStatusBadge } from '@/lib/task-utils'
import { formatDate } from '@/lib/utils'
import { FileText, ChevronLeft } from 'lucide-react'

interface RequestDetailContentProps {
  application: PlanningApplication
  request: ApplicantRequest
}

export function RequestDetailContent({ application, request }: RequestDetailContentProps) {
  return (
    <>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href={`/application/${application.id}/assessment?task=999`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to applicant requests
        </Link>
      </div>

      {/* Title and Status - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">{request.subject}</h1>

        <div className="mt-3 flex items-center gap-3">
          {getRequestStatusBadge(request.status, request.dueDate)}
          <span className="text-sm text-muted-foreground">
            Sent by {request.sentBy} on {formatDate(request.sentDate)}
          </span>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Content - constrained to 723px for readability */}
      <div className="mt-8 max-w-readable space-y-8">
        {/* Request Details Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Request
            </h2>
            <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
              {request.description}
            </p>
          </div>

          {request.dueDate && (
            <div className="flex items-center gap-2 text-base">
              <span className="font-medium">Due date:</span>
              <span className="text-foreground">{formatDate(request.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Response Section */}
        <div className="border-t border-border pt-8">
          {request.response ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Response
                </h2>
                <span className="text-sm text-muted-foreground">
                  Received {formatDate(request.response.receivedDate)}
                </span>
              </div>

              <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                {request.response.message}
              </p>

              {/* Attachments */}
              {request.response.attachments && request.response.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-3">
                    Attachments ({request.response.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {request.response.attachments.map((filename, index) => (
                      <a
                        key={index}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-muted-foreground flex-none" />
                        <span className="text-base text-primary hover:underline">
                          {filename}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Awaiting Response
              </h3>
              <p className="text-sm text-muted-foreground">
                The applicant has not yet responded to this request.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
