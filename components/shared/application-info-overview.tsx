import type { Application } from '@/lib/mock-data/schemas'
import { Separator } from '@/components/ui/separator'

interface ApplicationInfoOverviewProps {
  application: Application
}

export function ApplicationInfoOverview({ application }: ApplicationInfoOverviewProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Last updated: 12 October 2024</p>
      </div>

      {/* Single Combined Table */}
      <table className="w-full">
        <tbody>
          {/* Application Details Section */}
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Proposal description</td>
            <td className="py-2.5 text-base text-foreground">{application.description}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Application type</td>
            <td className="py-2.5 text-base text-foreground">{application.applicationType}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Case officer</td>
            <td className="py-2.5 text-base text-foreground">
              {application.assignedOfficer?.name || 'Not assigned'}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Work already started</td>
            <td className="py-2.5 text-base text-foreground">
              {application.workStarted !== undefined ? (application.workStarted ? 'Yes' : 'No') : '—'}
            </td>
          </tr>

          {/* Site Details Section */}
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Site address</td>
            <td className="py-2.5 text-base text-foreground">{application.address}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Location</td>
            <td className="py-2.5 text-base">
              {application.locationUrl ? (
                <a
                  href={application.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View site on Google Maps (opens in new tab)
                </a>
              ) : (
                '—'
              )}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Parish</td>
            <td className="py-2.5 text-base text-foreground">{application.parish || '—'}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Ward</td>
            <td className="py-2.5 text-base text-foreground">{application.ward || '—'}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Ward type</td>
            <td className="py-2.5 text-base text-foreground">{application.wardType || '—'}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">UPRN</td>
            <td className="py-2.5 text-base text-foreground">{application.uprn || '—'}</td>
          </tr>

          {/* Payment Details Section */}
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Payment reference</td>
            <td className="py-2.5 text-base text-foreground font-mono">
              {application.paymentReference || '—'}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Payment amount</td>
            <td className="py-2.5 text-base text-foreground">
              {application.paymentAmount !== undefined ? `£${application.paymentAmount.toFixed(2)}` : '—'}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-base text-foreground font-medium">Session ID</td>
            <td className="py-2.5 text-base text-foreground font-mono text-sm">
              {application.sessionId || '—'}
            </td>
          </tr>
        </tbody>
      </table>

      <Separator className="my-8" />

      {/* Submission Form */}
      <div className="mb-8">
        <h3 className="mb-3 text-xl font-bold text-foreground">Submission form</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2.5 text-base text-foreground font-bold text-left">Question</th>
              <th className="py-2.5 text-base text-foreground font-bold text-left">Answer</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">This is a new service</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Is the property in Doncaster?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Yes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of property is it?</td>
              <td className="py-2.5 text-base text-foreground font-bold">House</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of house is it?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Detached</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Is the property in a flood zone?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Does the property include any heritage assets?</td>
              <td className="py-2.5 text-base text-foreground font-bold">None of these</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of application is it?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Pre application advice</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Are you applying on behalf of someone else?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Can a planning officer see the works from public land?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Yes, it's visible from the road or somewhere else</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Which of these best describes you?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Private individual</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Your contact details</td>
              <td className="py-2.5 text-base text-foreground font-bold">Ted Hughes Poet Laureates 0123456789 ted@poetlaureates.org</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Is your contact address the same as the property address?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Yes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">We may need to visit the site to assess your application. If we do, who should we contact to arrange the visit?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Me, the applicant</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of application is this?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Other</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Which of these best describes your project?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Works or extensions to a house</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Does the site contain a tree protected by a Tree Preservation Order?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Are there any trees on the property?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Does the development build over existing utilities?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of pre-application are you applying for?</td>
              <td className="py-2.5 text-base text-foreground font-bold">Non-major pre application</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Planning Pre-Application Advice Services</td>
              <td className="py-2.5 text-base text-foreground font-bold">Written advice (£450)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">What type of application is this?</td>
              <td className="py-2.5 text-base text-foreground font-bold">None of these</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Connections with City of Doncaster Council</td>
              <td className="py-2.5 text-base text-foreground font-bold">None of the above apply to me</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Confirm the information in this application is correct</td>
              <td className="py-2.5 text-base text-foreground font-bold">I confirm that the information contained in this application is truthful, accurate and complete, to the best of my knowledge</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Would disclosure of any of the information you have provided harm someone's commercial interests?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 text-base text-foreground">Is any of the information you have provided sensitive?</td>
              <td className="py-2.5 text-base text-foreground font-bold">No</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
