import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AppNav from '@/components/AppNav'
import HealthProfileView from '@/components/HealthProfileView'

export default async function HealthProfilePage() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'PATIENT') redirect('/doctor')

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppNav />
      <HealthProfileView />
    </div>
  )
}
