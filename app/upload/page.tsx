import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AppNav from '@/components/AppNav'
import UploadForm from '@/components/UploadForm'

export default async function UploadPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'PATIENT') redirect('/doctor')

  return (
    <div className="min-h-screen bg-background-light">
      <AppNav />
      <UploadForm />
    </div>
  )
}
