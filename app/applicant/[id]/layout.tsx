import { ServiceNavigation } from '@/components/shared/service-navigation'

export default function ApplicantApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <>
      <ServiceNavigation applicationId={params.id} />
      {children}
    </>
  )
}
