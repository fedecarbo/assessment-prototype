import { ServiceNavigation } from '@/components/shared/service-navigation'

export default async function ApplicantApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <ServiceNavigation applicationId={id} />
      {children}
    </>
  )
}
