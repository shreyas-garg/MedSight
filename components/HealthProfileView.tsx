'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ReportAnalysis {
  patientName: string
  reportDate: string
  reportType: string
  keyFindings: any[]
  testResults: any[]
  medications: any[]
  questions: string[]
  summary: string
}

interface PatientReport {
  id: string
  fileName: string
  status: 'PENDING' | 'REVIEWED'
  feedback: string | null
  hasFile: boolean
  mimeType: string | null
  doctorName: string | null
  analysis: ReportAnalysis
}

export default function HealthProfileView() {
  const [reports, setReports] = useState<PatientReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/patient/reports')
      .then((res) => res.json())
      .then((data) => setReports(data.reports || []))
      .finally(() => setLoading(false))
  }, [])

  const viewDetailed = (r: PatientReport) => {
    sessionStorage.setItem(
      'reportAnalysis',
      JSON.stringify({
        analysis: r.analysis,
        fileName: r.fileName,
        reportId: r.id,
        reportStatus: r.status,
        feedback: r.feedback,
        hasFile: r.hasFile,
        mimeType: r.mimeType,
        doctorName: r.doctorName,
      })
    )
    window.location.href = '/dashboard'
  }

  return (
    <main className="flex-1 p-4 sm:p-8 bg-background-light overflow-auto">
      <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-black text-background-dark">Health Profile</h1>
        <Link href="/upload">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
            <span className="material-symbols-outlined text-lg">cloud_upload</span>
            Upload New Report
          </button>
        </Link>
      </header>

      {loading ? (
        <p className="text-center text-stone-500">Loading your reports...</p>
      ) : reports.length === 0 ? (
        <div className="text-center text-stone-500">
          <p>No reports found in your health profile.</p>
          <p>Start by uploading a medical report and analyzing it.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
              <div className="flex justify-between items-center gap-4 mb-4">
                <h2 className="font-semibold text-background-dark min-w-0 truncate">
                  {r.analysis?.reportType || r.fileName}
                </h2>
                <span className="text-xs text-stone-500 shrink-0">{r.analysis?.reportDate}</span>
              </div>
              <p className="text-sm text-stone-700 mb-2">{r.analysis?.summary}</p>
              <button
                className="text-sm font-semibold text-primary-dark hover:underline"
                onClick={() => viewDetailed(r)}
              >
                View Detailed Analysis
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
