import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export default async function DoctorDashboard() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'DOCTOR') redirect('/patient')

  return (
    <div className="min-h-screen bg-background-light">
      <header className="bg-white border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined text-2xl font-bold">clinical_notes</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-background-dark">MedSight</h1>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">stethoscope</span>
          </div>
          <h2 className="text-3xl font-black text-background-dark mb-2">Welcome, Dr. {user.name}</h2>
          <p className="text-slate-custom">
            Your doctor dashboard is coming together — pending patient reviews, patient history, and analytics will land here next.
          </p>
        </div>
      </main>
    </div>
  )
}
