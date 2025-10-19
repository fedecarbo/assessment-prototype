import { ProposalDescription } from './proposal-description'
import { RequestedServices } from './requested-services'
import { ApplicationMetadata } from './application-metadata'
import { ApplicationStageTimeline } from './application-stage-timeline'
import { DocumentList } from './document-list'
import { ConstraintsSummary } from './constraints-summary'
import { NeighbourConsultation } from './neighbour-consultation'
import { Badge } from '@/components/ui/badge'
import type { PlanningApplication } from '@/lib/mock-data/schemas'

interface ApplicationSectionsProps {
  application: PlanningApplication
}

export function ApplicationSections({ application }: ApplicationSectionsProps) {
  return (
    <>
      {/* Overview Details - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 pt-8">
        {/* Left Column: Main Content (66%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Description */}
          <ProposalDescription description={application.description} />

          {/* Application Type */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-foreground">Application type</h3>
            <Badge variant="gray">
              {application.applicationType}
            </Badge>
          </div>

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
          />
        </div>
      </div>

      <hr className="border-border" />

      {/* Application Progress Section */}
      <section
        id="progress"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="progress-heading"
      >
        <ApplicationStageTimeline application={application} />
      </section>

      <hr className="border-border" />

      {/* Documents Section */}
      <section
        id="documents"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="documents-heading"
      >
        <h2 id="documents-heading" className="text-xl font-bold text-foreground mb-6">
          Documents
        </h2>
        <DocumentList documents={application.documents} />
      </section>

      <hr className="border-border" />

      {/* Constraints Section */}
      <section
        id="constraints"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="constraints-heading"
      >
        <h2 id="constraints-heading" className="text-xl font-bold text-foreground mb-4">
          Constraints
        </h2>
        <ConstraintsSummary constraints={application.constraints} applicationId={application.id} />
      </section>

      <hr className="border-border" />

      {/* Site History Section */}
      <section
        id="site-history"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="site-history-heading"
      >
        <h2 id="site-history-heading" className="text-xl font-bold text-foreground mb-4">
          Site history
        </h2>
        <div className="min-h-[300px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Previous planning applications and site history will be displayed here.
          </p>
        </div>
      </section>

      <hr className="border-border" />

      {/* Consultees Section */}
      <section
        id="consultees"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="consultees-heading"
      >
        <h2 id="consultees-heading" className="text-xl font-bold text-foreground mb-4">
          Consultees
        </h2>
        <div className="min-h-[200px] border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Statutory consultees and consultation responses will be displayed here.
          </p>
        </div>
      </section>

      <hr className="border-border" />

      {/* Neighbours Section */}
      <section
        id="neighbours"
        className="scroll-mt-[160px] pb-8 pt-8"
        aria-labelledby="neighbours-heading"
      >
        <h2 id="neighbours-heading" className="text-xl font-bold text-foreground mb-4">
          Neighbours
        </h2>
        {application.neighbourConsultation ? (
          <NeighbourConsultation consultation={application.neighbourConsultation} />
        ) : (
          <div className="min-h-[200px] border-2 border-dashed border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Neighbour notifications and responses will appear here.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
