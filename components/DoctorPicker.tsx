'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Doctor = { id: string; name: string; email: string }

export default function DoctorPicker() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      router.refresh()
    } catch (err: any) {
      setError(err.message)
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

  return (
    <div className="text-left">
      <h3 className="text-lg font-bold text-background-dark mb-1">Connect with a doctor</h3>
      <p className="text-sm text-slate-custom mb-5">Choose a doctor to review your reports and give you feedback.</p>
      <div className="flex flex-col gap-3">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelect(doc.id)}
            disabled={saving}
            className="flex items-center justify-between px-5 py-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">stethoscope</span>
              <div>
                <p className="font-bold text-background-dark text-sm">Dr. {doc.name}</p>
                <p className="text-xs text-slate-custom">{doc.email}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm font-medium mt-4">{error}</p>}
    </div>
  )
}
