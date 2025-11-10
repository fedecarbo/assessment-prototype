import { redirect } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'

export default function ApplicantPage() {
  // Get the first application (in a real system, this would be the logged-in user's applications)
  const firstApplication = mockApplications[0]

  if (!firstApplication) {
    // If no applications, show empty state or redirect elsewhere
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">No applications found</h1>
        <p className="text-base text-muted-foreground mt-3">
          You don't have any planning applications yet.
        </p>
      </div>
    )
  }

  // Redirect to the first application's requests page
  redirect(`/applicant/${firstApplication.id}/requests`)
}
