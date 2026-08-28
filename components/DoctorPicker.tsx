'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Doctor = { id: string; name: string; email: string }

export default function DoctorPicker({
  currentDoctorId = null,
  currentDoctorName = null,
}: {
  currentDoctorId?: string | null
  currentDoctorName?: string | null
}) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  // When already connected, keep the list collapsed until they ask to change.
  const [changing, setChanging] = useState(!currentDoctorId)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data.doctors || []))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (doctorId: string) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/patient/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect with doctor')
      setChanging(false)
      setQuery('')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-custom">Loading available doctors...</p>
  }

  if (doctors.length === 0) {
    return (
      <p className="text-sm text-slate-custom">
        No doctors have signed up yet. Once one does, you&apos;ll be able to connect with them here.
      </p>
    )
  }

  const q = query.trim().toLowerCase()
  const filteredDoctors = q
    ? doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.email.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q)
      )
    : doctors

  return (
    <div className="text-left">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <h3 className="text-lg font-bold text-background-dark mb-1">
            {currentDoctorId ? 'Your doctor' : 'Connect with a doctor'}
          </h3>
          {currentDoctorId ? (
            <p className="text-sm text-slate-custom">
              Connected with <span className="font-bold text-background-dark">Dr. {currentDoctorName}</span>. New reports
              go to them for review.
            </p>
          ) : (
            <p className="text-sm text-slate-custom">Choose a doctor to review your reports and give you feedback.</p>
          )}
        </div>
        {currentDoctorId && (
          <button
            onClick={() => setChanging((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">{changing ? 'close' : 'swap_horiz'}</span>
            {changing ? 'Cancel' : 'Change doctor'}
          </button>
        )}
      </div>

      {changing && (
        <>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or ID"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>

          {filteredDoctors.length === 0 ? (
            <p className="text-sm text-slate-custom">No doctors match &quot;{query}&quot;.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredDoctors.map((doc) => {
                const isCurrent = doc.id === currentDoctorId
                return (
                  <button
                    key={doc.id}
                    onClick={() => !isCurrent && handleSelect(doc.id)}
                    disabled={saving || isCurrent}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all text-left disabled:opacity-60 ${
                      isCurrent
                        ? 'border-primary bg-primary/5 cursor-default'
                        : 'border-slate-200 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-primary shrink-0">stethoscope</span>
                      <div className="min-w-0">
                        <p className="font-bold text-background-dark text-sm truncate">Dr. {doc.name}</p>
                        <p className="text-xs text-slate-custom truncate">{doc.email}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-primary shrink-0">Current</span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 shrink-0">chevron_right</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {error && <p className="text-red-600 text-sm font-medium mt-4">{error}</p>}
    </div>
  )
}
