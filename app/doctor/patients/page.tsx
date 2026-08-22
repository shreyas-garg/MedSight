import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import PatientHistoryExplorer from '@/components/PatientHistoryExplorer'

export default async function DoctorPatientsPage() {
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

      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-6">
        <Link href="/doctor" className="flex items-center gap-1 text-sm font-semibold text-slate-custom hover:text-background-dark transition-colors w-fit">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-black text-background-dark mb-1">Patient History</h2>
          <p className="text-sm text-slate-custom mb-8">Review a patient&apos;s full report timeline.</p>
          <PatientHistoryExplorer />
        </div>
      </main>
    </div>
  )
}
