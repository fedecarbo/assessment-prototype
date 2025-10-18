import { ProposalDescription } from './proposal-description'
import { RequestedServices } from './requested-services'
import { ApplicationMetadata } from './application-metadata'
import { ApplicationStageTimeline } from './application-stage-timeline'
import type { PlanningApplication } from '@/lib/mock-data/schemas'

interface ApplicationSectionsProps {
  application: PlanningApplication
}

export function ApplicationSections({ application }: ApplicationSectionsProps) {
  return (
    <>
      {/* Overview Details - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        {/* Left Column: Main Content (66%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Description */}
          <ProposalDescription description={application.description} />

          {/* Requested Services */}
          {application.requestedServices && (
            <RequestedServices services={application.requestedServices} />
          )}
        </div>

        {/* Right Column: Metadata Sidebar (33%) */}
        <div className="lg:col-span-1">
          <ApplicationMetadata
            assignedOfficer={application.assignedOfficer}
            isPublic={application.isPublic}
            applicationType={application.applicationType}
          />
        </div>
      </div>

      <hr className="border-border" />

      {/* Application Progress Section */}
      <section
        id="progress"
        className="scroll-mt-[160px] space-y-4 pb-8 pt-8"
        aria-labelledby="progress-heading"
      >
        <ApplicationStageTimeline application={application} />
        <hr className="border-border" />
      </section>

      {/* Documents Section */}
      <section
        id="documents"
        className="scroll-mt-[160px] space-y-4 pb-8 pt-8"
        aria-labelledby="documents-heading"
      >
        <h2 id="documents-heading" className="text-xl font-bold text-foreground">
          Documents
        </h2>
        <div className="min-h-[300px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Document list and management will be displayed here. Users can view and download
            application documents.
          </p>
        </div>
        <hr className="border-border" />
      </section>

      {/* Assessment Section */}
      <section
        id="assessment"
        className="scroll-mt-[160px] space-y-4 pb-8 pt-8"
        aria-labelledby="assessment-heading"
      >
        <h2 id="assessment-heading" className="text-xl font-bold text-foreground">
          Assessment
        </h2>
        <div className="min-h-[300px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Planning assessment details, conditions, and recommendations will be shown here.
          </p>
        </div>
        <hr className="border-border" />
      </section>

      {/* History Section */}
      <section
        id="history"
        className="scroll-mt-[160px] space-y-4 pb-8 pt-8"
        aria-labelledby="history-heading"
      >
        <h2 id="history-heading" className="text-xl font-bold text-foreground">
          History
        </h2>
        <div className="min-h-[300px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Application history timeline and status changes will be displayed here.
          </p>
        </div>
        <hr className="border-border" />
      </section>

      {/* Comments Section */}
      <section
        id="comments"
        className="scroll-mt-[160px] space-y-4 pb-8 pt-8"
        aria-labelledby="comments-heading"
      >
        <h2 id="comments-heading" className="text-xl font-bold text-foreground">
          Comments
        </h2>
        <div className="min-h-[300px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Internal comments and notes about the application will appear here.
          </p>
        </div>
      </section>
    </>
  )
}
