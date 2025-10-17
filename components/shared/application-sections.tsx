export function ApplicationSections() {
  return (
    <>
      {/* Overview Details - Below Navigation */}
      <div className="mb-8 space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-6">
            {/* Proposal Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Proposal Description</h3>
              <div className="min-h-[100px] rounded border-2 border-dashed border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Proposal description will be displayed here. This will contain detailed information
                  about the planning application proposal.
                </p>
              </div>
            </div>

            {/* Planning Officer */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Planning Officer</h3>
              <div className="flex items-center gap-3 rounded border-2 border-dashed border-gray-200 bg-gray-50 p-4">
                {/* Avatar Placeholder */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                  <svg
                    className="h-6 w-6 text-gray-600"
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
                  <p className="text-sm font-medium text-gray-900">Officer Name</p>
                  <p className="text-xs text-gray-500">Planning Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <section
        id="documents"
        className="scroll-mt-[100px] space-y-4"
        aria-labelledby="documents-heading"
      >
        <h2 id="documents-heading" className="text-2xl font-bold text-gray-900">
          Documents
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">
            Document list and management will be displayed here. Users can view and download
            application documents.
          </p>
        </div>
        <div className="h-96"></div>
      </section>

      {/* Assessment Section */}
      <section
        id="assessment"
        className="scroll-mt-[100px] space-y-4"
        aria-labelledby="assessment-heading"
      >
        <h2 id="assessment-heading" className="text-2xl font-bold text-gray-900">
          Assessment
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">
            Planning assessment details, conditions, and recommendations will be shown here.
          </p>
        </div>
        <div className="h-96"></div>
      </section>

      {/* History Section */}
      <section
        id="history"
        className="scroll-mt-[100px] space-y-4"
        aria-labelledby="history-heading"
      >
        <h2 id="history-heading" className="text-2xl font-bold text-gray-900">
          History
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">
            Application history timeline and status changes will be displayed here.
          </p>
        </div>
        <div className="h-96"></div>
      </section>

      {/* Comments Section */}
      <section
        id="comments"
        className="scroll-mt-[100px] space-y-4"
        aria-labelledby="comments-heading"
      >
        <h2 id="comments-heading" className="text-2xl font-bold text-gray-900">
          Comments
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-600">
            Internal comments and notes about the application will appear here.
          </p>
        </div>
        <div className="h-96"></div>
      </section>
    </>
  )
}
