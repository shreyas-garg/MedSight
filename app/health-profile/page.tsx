'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import type { ReportAnalysis } from '../lib/sample-report'

interface StoredReport {
  fileName: string
  fileSize: number
  analysis: ReportAnalysis
}

export default function HealthProfilePage() {
  const [reports, setReports] = useState<StoredReport[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthReports')
      if (stored) setReports(JSON.parse(stored))
    } catch (e) {
      console.error('Failed to load health profile reports', e)
    } finally {
      setLoaded(true)
    }
  }, [])

  const openReport = (report: StoredReport) => {
    // Save this report for the dashboard. Drop any cached file from an earlier
    // upload so the preview cannot show the wrong document.
    sessionStorage.setItem('reportAnalysis', JSON.stringify(report))
    sessionStorage.removeItem('reportFile')
    window.location.href = '/dashboard'
  }

  const deleteReport = (index: number) => {
    const next = reports.filter((_, i) => i !== index)
    setReports(next)
    localStorage.setItem('healthReports', JSON.stringify(next))
  }

  const clearAll = () => {
    if (!confirm('Delete all saved reports from this browser? This cannot be undone.')) return
    setReports([])
    localStorage.removeItem('healthReports')
  }

  // Every abnormal value across every stored report, newest first.
  const flaggedCount = reports.reduce(
    (total, r) => total + (r.analysis?.testResults ?? []).filter((t) => t.status !== 'normal').length,
    0
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active="/health-profile" />

      <main className="flex-1 p-8 bg-background-light dark:bg-slate-950 overflow-auto custom-scrollbar">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-background-dark dark:text-white">
              Health Profile
            </h1>
            <p className="text-sm text-stone-500 dark:text-slate-400 mt-1">
              Saved on this device only. Clearing your browser data removes this history.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {reports.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-stone-500 dark:text-slate-400 font-bold rounded-lg text-sm hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">delete_sweep</span>
                Clear all
              </button>
            )}
            <Link href="/upload">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                Upload New Report
              </button>
            </Link>
          </div>
        </header>

        {/* Summary tiles */}
        {reports.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-w-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-1">
                Reports
              </p>
              <p className="text-2xl font-black text-background-dark dark:text-white">
                {reports.length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-1">
                Flagged values
              </p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {flaggedCount}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-4 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-1">
                Latest
              </p>
              <p className="text-sm font-bold text-background-dark dark:text-white truncate">
                {reports[reports.length - 1]?.analysis?.reportDate || '—'}
              </p>
            </div>
          </div>
        )}

        {!loaded ? null : reports.length === 0 ? (
          <div className="max-w-md mx-auto mt-16 text-center flex flex-col items-center gap-4">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">monitoring</span>
            </div>
            <h2 className="text-xl font-bold text-background-dark dark:text-white">
              No reports yet
            </h2>
            <p className="text-stone-500 dark:text-slate-400">
              Analyses you run are saved here in this browser, so you can compare results over time.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/upload">
                <button className="flex items-center gap-2 px-5 py-3 bg-primary text-background-dark font-bold rounded-xl text-sm hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  Upload a report
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-background-dark dark:text-white border border-stone-200 dark:border-slate-700 font-bold rounded-xl text-sm hover:bg-stone-50 dark:hover:bg-slate-700 transition-all">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  See a sample
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {reports
              .map((report, idx) => ({ report, idx }))
              .reverse()
              .map(({ report, idx }) => {
                const flagged = (report.analysis?.testResults ?? []).filter(
                  (t) => t.status !== 'normal'
                )
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-stone-200 dark:border-slate-800 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-background-dark dark:text-white truncate">
                          {report.fileName}
                        </h2>
                        <p className="text-xs text-stone-500 dark:text-slate-400">
                          {report.analysis?.reportType}
                          {report.analysis?.patientName
                            ? ` • ${report.analysis.patientName}`
                            : ''}
                        </p>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-slate-400 shrink-0">
                        {report.analysis?.reportDate}
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 dark:text-slate-300 mb-4 line-clamp-3">
                      {report.analysis?.summary}
                    </p>

                    {flagged.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {flagged.slice(0, 4).map((test, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-[11px] font-semibold text-amber-700 dark:text-amber-400"
                          >
                            {test.testName}: {test.result}
                          </span>
                        ))}
                        {flagged.length > 4 && (
                          <span className="px-2 py-1 text-[11px] font-semibold text-stone-400 dark:text-slate-500">
                            +{flagged.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openReport(report)}
                        className="text-sm font-semibold text-primary-dark dark:text-primary hover:underline"
                      >
                        View Detailed Analysis
                      </button>
                      <button
                        onClick={() => deleteReport(idx)}
                        className="text-sm font-semibold text-stone-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </main>
    </div>
  )
}
