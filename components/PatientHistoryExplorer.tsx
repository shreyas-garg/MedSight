'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { buildTestProgressions } from '@/lib/analytics'
import TestProgressionCard from '@/components/TestProgressionCard'
import RehabTaskManager from '@/components/RehabTaskManager'

type PatientSummary = { id: string; name: string; email: string; reportCount: number }

type TestResult = { testName: string; result: string; referenceRange: string; status: string }
type KeyFinding = { severity: string; description: string }
type ReportDetail = {
  id: string
  fileName: string
  status: 'PENDING' | 'REVIEWED'
  feedback: string | null
  createdAt: string
  hasFile: boolean
  analysis: {
    reportType?: string
    summary?: string
    keyFindings?: KeyFinding[]
    testResults?: TestResult[]
  }
}

export default function PatientHistoryExplorer({
  initialPatientId = null,
}: {
  initialPatientId?: string | null
}) {
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [reports, setReports] = useState<ReportDetail[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingReports, setLoadingReports] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/doctor/patients')
      .then((res) => res.json())
      .then((data) => {
        const list: PatientSummary[] = data.patients || []
        setPatients(list)
        if (list.length === 0) return
        // Honour ?patient=<id> when it's actually one of this doctor's patients
        const requested = initialPatientId && list.some((p) => p.id === initialPatientId) ? initialPatientId : null
        setSelectedId(requested ?? list[0].id)
      })
      .finally(() => setLoadingPatients(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPatientId])

  useEffect(() => {
    if (!selectedId) {
      setReports([])
      return
    }
    setLoadingReports(true)
    fetch(`/api/doctor/patients/${selectedId}/reports`)
      .then((res) => res.json())
      .then((data) => setReports(data.reports || []))
      .finally(() => setLoadingReports(false))
  }, [selectedId])

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    )
  }, [patients, query])

  useEffect(() => {
    if (filteredPatients.length === 0) {
      if (selectedId) setSelectedId('')
      return
    }
    if (!filteredPatients.some((p) => p.id === selectedId)) {
      setSelectedId(filteredPatients[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPatients])

  const progressions = useMemo(() => buildTestProgressions(reports), [reports])

  if (loadingPatients) return <p className="text-sm text-slate-custom">Loading your patients...</p>

  if (patients.length === 0) {
    return <p className="text-sm text-slate-custom">No patients have connected with you yet.</p>
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-background-dark mb-2">Search patients</label>
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or patient ID"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <p className="text-sm text-slate-custom mb-8">No patients match &quot;{query}&quot;.</p>
      ) : (
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mb-8 bg-white"
        >
          {filteredPatients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email}) — {p.reportCount} report{p.reportCount === 1 ? '' : 's'}
            </option>
          ))}
        </select>
      )}

      {selectedId && !loadingReports && progressions.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold text-background-dark mb-1">Health Analytics</h3>
          <p className="text-sm text-slate-custom mb-4">Tracked values with more than one reading, oldest to latest.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progressions.map((p) => (
              <TestProgressionCard key={p.testName} progression={p} />
            ))}
          </div>
        </div>
      )}

      {selectedId && (
        <div className="mb-10">
          <RehabTaskManager patientId={selectedId} />
        </div>
      )}

      {selectedId && !loadingReports && reports.length > 0 && (
        <h3 className="text-lg font-bold text-background-dark mb-4">Visit Timeline</h3>
      )}

      {!selectedId ? null : loadingReports ? (
        <p className="text-sm text-slate-custom">Loading history...</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-slate-custom">This patient hasn&apos;t submitted any reports yet.</p>
      ) : (
        <div className="relative flex flex-col gap-6 pl-6 border-l-2 border-slate-200">
          {reports.map((r, i) => (
            <div key={r.id} className="relative">
              <div className="absolute -left-[29px] top-1 size-3.5 rounded-full bg-primary border-2 border-white shadow" />
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">
                      Visit {i + 1} • {new Date(r.createdAt).toLocaleDateString('en-US')}
                    </p>
                    <p className="font-bold text-background-dark text-sm">{r.analysis?.reportType || r.fileName}</p>
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

                <div className="flex items-center gap-5 flex-wrap mt-3">
                  <Link
                    href={`/doctor/reports/${r.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-lg">open_in_full</span>
                    Open full report
                  </Link>
                  {r.hasFile && (
                    <a
                      href={`/api/reports/${r.id}/file`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-lg">description</span>
                      Original document
                    </a>
                  )}
                </div>

                {r.analysis?.testResults && r.analysis.testResults.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-slate-400 uppercase tracking-wide">
                          <th className="pb-2 pr-4 font-bold">Test</th>
                          <th className="pb-2 pr-4 font-bold">Result</th>
                          <th className="pb-2 pr-4 font-bold">Reference</th>
                          <th className="pb-2 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.analysis.testResults.map((t, idx) => (
                          <tr key={idx} className="border-t border-slate-100">
                            <td className="py-2 pr-4 font-semibold text-background-dark">{t.testName}</td>
                            <td className="py-2 pr-4">{t.result}</td>
                            <td className="py-2 pr-4 text-slate-500">{t.referenceRange}</td>
                            <td className="py-2">
                              <span
                                className={`font-bold ${
                                  t.status === 'low' || t.status === 'high'
                                    ? 'text-amber-600'
                                    : t.status === 'critical'
                                    ? 'text-red-600'
                                    : 'text-primary'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {r.feedback && (
                  <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">Your Feedback</p>
                    <p className="text-sm text-slate-700">{r.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
