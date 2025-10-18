// Placeholder height for development sections
const SECTION_PLACEHOLDER_HEIGHT = 'h-[--spacing-section-placeholder]'

export function ApplicationSections() {
  return (
    <>
      {/* Overview Details - Below Navigation */}
      <div className="mb-8 space-y-6 pb-8">
        {/* Proposal Description */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Proposal Description</h3>
          <div className="min-h-[100px] rounded border-2 border-dashed border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Proposal description will be displayed here. This will contain detailed information
              about the planning application proposal.
            </p>
          </div>
        </div>

        {/* Planning Officer */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Planning Officer</h3>
          <div className="flex items-center gap-3 rounded border-2 border-dashed border-border bg-muted p-4">
            {/* Avatar Placeholder */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground/20">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Officer Name</p>
              <p className="text-xs text-muted-foreground">Planning Officer</p>
            </div>
          </div>
        </div>

        <hr className="border-border" />
      </div>

      {/* Documents Section */}
      <section
        id="documents"
        className="scroll-mt-[160px] space-y-4 pb-8"
        aria-labelledby="documents-heading"
      >
        <h2 id="documents-heading" className="text-xl font-bold text-foreground">
          Documents
        </h2>
        <div className="min-h-[300px] rounded border-2 border-dashed border-border bg-muted p-4">
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
        <div className="min-h-[300px] rounded border-2 border-dashed border-border bg-muted p-4">
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
        <div className="min-h-[300px] rounded border-2 border-dashed border-border bg-muted p-4">
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
        <div className="min-h-[300px] rounded border-2 border-dashed border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Internal comments and notes about the application will appear here.
          </p>
        </div>
      </section>
    </>
  )
}
