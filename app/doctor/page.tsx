import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import AppNav from '@/components/AppNav'
import DoctorReportsList from '@/components/DoctorReportsList'

export default async function DoctorDashboard() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'DOCTOR') redirect('/patient')

  return (
    <div className="min-h-screen bg-background-light">
      <AppNav />

      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-primary">stethoscope</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-background-dark">Welcome, Dr. {user.name}</h2>
                <p className="text-sm text-slate-custom">Review your patients&apos; reports and send feedback.</p>
              </div>
            </div>
            <Link href="/doctor/patients">
              <button className="flex items-center gap-2 bg-background-dark text-white px-5 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-lg">history</span>
                Patient History
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <DoctorReportsList />
        </div>
      </main>
    </div>
  )
}
