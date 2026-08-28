'use client'

import { useEffect, useState } from 'react'

type PatientReport = {
  id: string
  fileName: string
  status: 'PENDING' | 'REVIEWED'
  feedback: string | null
  createdAt: string
  analysis: { reportType?: string; summary?: string }
}

export default function PatientReportsList() {
  const [reports, setReports] = useState<PatientReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/patient/reports')
      .then((res) => res.json())
      .then((data) => setReports(data.reports || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-slate-custom">Loading your reports...</p>

  if (reports.length === 0) {
    return <p className="text-sm text-slate-custom">You haven&apos;t submitted any reports yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((r) => (
        <div key={r.id} className="border border-slate-200 rounded-xl p-5 text-left">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="font-bold text-background-dark text-sm">{r.analysis?.reportType || r.fileName}</p>
              <p className="text-xs text-slate-custom">{new Date(r.createdAt).toLocaleDateString('en-US')}</p>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                r.status === 'REVIEWED' ? 'bg-primary/10 text-primary-dark' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {r.status === 'REVIEWED' ? 'Reviewed' : 'Pending review'}
            </span>
          </div>
          {r.feedback && (
            <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark mb-1">Doctor&apos;s Feedback</p>
              <p className="text-sm text-slate-700">{r.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
