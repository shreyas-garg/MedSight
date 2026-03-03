'use client'

import { useState, useEffect } from 'react'
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

interface StoredReport {
  fileName: string
  fileSize: number
  analysis: ReportAnalysis
}

export default function HealthProfilePage() {
  const [reports, setReports] = useState<StoredReport[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthReports')
      if (stored) {
        setReports(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load health profile reports', e)
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* reuse sidebar from dashboard */}
      <aside className="w-64 bg-white border-r border-primary/10 flex flex-col h-full">
        <div className="p-6 flex items-center gap-3">
          <Link href="/">
            <div className="bg-primary p-2 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined text-background-dark">analytics</span>
            </div>
          </Link>
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-background-dark cursor-pointer">MedSight</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-4">
          <p className="px-3 text-xs font-semibold text-primary/60 uppercase tracking-wider mb-2">Main Menu</p>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-primary/10 transition-colors font-medium" href="/dashboard">
            <span className="material-symbols-outlined">description</span>
            My Reports
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-primary/10 transition-colors font-medium" href="/upload">
            <span className="material-symbols-outlined">cloud_upload</span>
            New Upload
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg active-nav font-medium" href="/health-profile">
            <span className="material-symbols-outlined">monitoring</span>
            Health Profile
          </a>
          <div className="pt-6">
            <p className="px-3 text-xs font-semibold text-primary/60 uppercase tracking-wider mb-2">System</p>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-primary/10 transition-colors font-medium" href="#">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
          </div>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-xs font-medium text-stone-600 mb-2">Need help?</p>
            <button className="w-full py-2 bg-white text-xs font-bold rounded-lg border border-primary/20 shadow-sm text-background-dark hover:bg-primary/5 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-background-light overflow-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-background-dark">Health Profile</h1>
          <Link href="/upload">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              Upload New Report
            </button>
          </Link>
        </header>

        {reports.length === 0 ? (
          <div className="text-center text-stone-500">
            <p>No reports found in your health profile.</p>
            <p>Start by uploading a medical report and analyzing it.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((r, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-background-dark">{r.fileName}</h2>
                  <span className="text-xs text-stone-500">{r.analysis.reportDate}</span>
                </div>
                <p className="text-sm text-stone-700 mb-2">{r.analysis.summary}</p>
                <button
                  className="text-sm font-semibold text-primary hover:underline"
                  onClick={() => {
                    // save this report to sessionStorage and navigate to dashboard
                    sessionStorage.setItem('reportAnalysis', JSON.stringify(r))
                    window.location.href = '/dashboard'
                  }}
                >
                  View Detailed Analysis
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
