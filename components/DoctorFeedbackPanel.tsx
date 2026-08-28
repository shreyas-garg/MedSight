'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DoctorFeedbackPanel({
  reportId,
  status,
  existingFeedback,
}: {
  reportId: string
  status: 'PENDING' | 'REVIEWED'
  existingFeedback: string | null
}) {
  const [editing, setEditing] = useState(status !== 'REVIEWED')
  const [draft, setDraft] = useState(existingFeedback ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const submit = async () => {
    if (!draft.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/doctor/reports/${reportId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: draft }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save feedback')
      setEditing(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="border-2 border-primary/30 bg-primary/5 rounded-xl p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-background-dark p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-lg">rate_review</span>
          </div>
          <h3 className="text-lg font-bold text-background-dark">Your Feedback</h3>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            status === 'REVIEWED' ? 'bg-primary/20 text-primary' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {status === 'REVIEWED' ? 'Reviewed' : 'Pending review'}
        </span>
      </div>

      {editing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Explain the findings for this patient, and what they should do next..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-y bg-white"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={submit}
              disabled={saving || !draft.trim()}
              className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : status === 'REVIEWED' ? 'Update Feedback' : 'Send Feedback'}
            </button>
            {status === 'REVIEWED' && (
              <button
                onClick={() => {
                  setEditing(false)
                  setDraft(existingFeedback ?? '')
                  setError(null)
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-custom hover:bg-white transition-all"
              >
                Cancel
              </button>
            )}
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{existingFeedback}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit feedback
          </button>
        </div>
      )}
    </section>
  )
}
