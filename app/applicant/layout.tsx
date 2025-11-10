import { SiteHeader } from '@/components/shared/site-header'

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader userType="applicant" />
      {children}
    </div>
  )
}
