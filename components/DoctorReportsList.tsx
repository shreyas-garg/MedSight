'use client'

import { useEffect, useState } from 'react'

type DoctorReport = {
  id: string
  fileName: string
  status: 'PENDING' | 'REVIEWED'
  feedback: string | null
  createdAt: string
  analysis: { reportType?: string; summary?: string }
  patient: { id: string; name: string; email: string }
}

export default function DoctorReportsList() {
  const [reports, setReports] = useState<DoctorReport[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedbackDraft, setFeedbackDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    fetch('/api/doctor/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports || [])
        setPendingCount(data.pendingCount || 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitFeedback = async (id: string) => {
    if (!feedbackDraft.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/doctor/reports/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackDraft }),
      })
      if (res.ok) {
        setFeedbackDraft('')
        setExpandedId(null)
        load()
      }
    } finally {
      setSubmitting(false)
    }
  }

return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-background-dark">Patient Reports</h3>
        {!loading && pendingCount > 0 && (
          <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm">notifications</span>
            {pendingCount} pending review{pendingCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-custom">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-slate-custom">No reports from your patients yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
        <div key={r.id} className="border border-slate-200 rounded-xl p-5 text-left">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="font-bold text-background-dark text-sm">{r.patient.name}</p>
              <p className="text-xs text-slate-custom">
                {r.analysis?.reportType || r.fileName} • {new Date(r.createdAt).toLocaleDateString('en-US')}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                r.status === 'REVIEWED' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {r.status === 'REVIEWED' ? 'Reviewed' : 'Pending review'}
            </span>
          </div>

          {r.analysis?.summary && <p className="text-sm text-slate-600 mt-2">{r.analysis.summary}</p>}

          {r.status === 'REVIEWED' ? (
            <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">Your Feedback</p>
              <p className="text-sm text-slate-700">{r.feedback}</p>
            </div>
          ) : expandedId === r.id ? (
            <div className="mt-4 flex flex-col gap-3">
              <textarea
                value={feedbackDraft}
                onChange={(e) => setFeedbackDraft(e.target.value)}
                placeholder="Write feedback for this patient..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => submitFeedback(r.id)}
                  disabled={submitting || !feedbackDraft.trim()}
                  className="bg-primary text-background-dark px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Feedback'}
                </button>
                <button
                  onClick={() => {
                    setExpandedId(null)
                    setFeedbackDraft('')
                  }}
                  className="px-5 py-2 rounded-lg text-sm font-bold text-slate-custom hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setExpandedId(r.id)}
              className="mt-3 text-sm font-bold text-primary hover:underline"
            >
              Give feedback
            </button>
          )}
        </div>
          ))}
        </div>
      )}
    </div>
  )
}
