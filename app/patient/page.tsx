import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import LogoutButton from '@/components/LogoutButton'
import DoctorPicker from '@/components/DoctorPicker'
import PatientReportsList from '@/components/PatientReportsList'
import RehabChecklist from '@/components/RehabChecklist'

export default async function PatientDashboard() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'PATIENT') redirect('/doctor')

  const doctor = user.doctorId
    ? await prisma.user.findUnique({ where: { id: user.doctorId }, select: { name: true } })
    : null

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

      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">personal_injury</span>
          </div>
          <h2 className="text-3xl font-black text-background-dark mb-2">Welcome, {user.name}</h2>
          {doctor ? (
            <p className="text-slate-custom mb-6">
              You&apos;re connected with <span className="font-bold text-background-dark">Dr. {doctor.name}</span>.
              Reports you upload will appear in their review queue.
            </p>
          ) : (
            <p className="text-slate-custom mb-6">Upload reports for AI analysis, and connect with a doctor to get feedback.</p>
          )}
          <Link href="/upload">
            <button className="bg-primary text-background-dark px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
              Upload a Report
            </button>
          </Link>
        </div>

        {!doctor && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <DoctorPicker />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-background-dark mb-5">Daily Rehabilitation</h3>
          <RehabChecklist />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-background-dark mb-5">Your Reports</h3>
          <PatientReportsList />
        </div>
      </main>
    </div>
  )
}
