import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppNav from '@/components/AppNav'
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
      <AppNav />

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

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <DoctorPicker currentDoctorId={user.doctorId} currentDoctorName={doctor?.name ?? null} />
        </div>

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
