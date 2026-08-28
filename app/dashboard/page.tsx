'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppNav from '@/components/AppNav'
import SampleDocument from '../components/SampleDocument'
import { SAMPLE_ANALYSIS, SAMPLE_FILE_NAME } from '../lib/sample-report'
import OriginalDocument from '@/components/OriginalDocument'
import ReportAnalysisPanel from '@/components/ReportAnalysisPanel'

interface TestResult {
  testName: string
  result: string
  referenceRange: string
  status: 'normal' | 'low' | 'high'
}

interface KeyFinding {
  severity: 'normal' | 'warning' | 'critical'
  description: string
}

interface Medication {
  name: string
  dosage: string
  purpose: string
}

interface ReportAnalysis {
  patientName: string
  reportDate: string
  reportType: string
  keyFindings: KeyFinding[]
  testResults: TestResult[]
  medications: Medication[]
  questions: string[]
  summary: string
}

type ReviewStatus = {
  reportId: string
  doctorName: string | null
  status: 'PENDING' | 'REVIEWED'
  feedback: string | null
  hasFile: boolean
  mimeType: string | null
}

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [review, setReview] = useState<ReviewStatus | null>(null)

  useEffect(() => {
    // Load analysis data from sessionStorage
    const storedData = sessionStorage.getItem('reportAnalysis')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setAnalysis(data.analysis)
        setFileName(data.fileName || 'Medical Report')
        if (data.reportId) {
          setReview({
            reportId: data.reportId,
            doctorName: data.doctorName ?? null,
            status: data.reportStatus ?? 'PENDING',
            feedback: data.feedback ?? null,
            hasFile: data.hasFile ?? true,
            mimeType: data.mimeType ?? null,
          })
        }
      } catch (err) {
        console.error('Failed to load analysis data:', err)
      }
    }
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  // Refresh with the live review status in case the doctor reviewed it after upload
  useEffect(() => {
    if (!review?.reportId) return
    fetch('/api/patient/reports')
      .then((res) => res.json())
      .then((data) => {
        const match = (data.reports || []).find((r: any) => r.id === review.reportId)
        if (match) {
          setReview((prev) =>
            prev
              ? {
                  ...prev,
                  status: match.status,
                  feedback: match.feedback,
                  hasFile: match.hasFile,
                  mimeType: match.mimeType ?? null,
                }
              : prev
          )
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review?.reportId])

  // Nothing uploaded -> sample mode: sample summary AND a matching sample
  // document, both from app/lib/sample-report.ts so they cannot drift apart.
  const isSample = analysis === null
  const displayAnalysis = analysis ?? SAMPLE_ANALYSIS

  const displayFileName = fileName || SAMPLE_FILE_NAME
  const hasStoredFile = Boolean(review?.reportId && review.hasFile)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">
        {/* Sample-mode banner: says plainly that this is not the user's data */}
        {isSample && (
          <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="material-symbols-outlined text-amber-500 text-xl">visibility</span>
            <p className="text-sm text-amber-900 flex-1 min-w-[16rem]">
              <span className="font-bold">This is a sample report.</span> Both panes below show
              example data for a fictional patient, so you can see what MedSight produces before
              uploading anything.
            </p>
            <Link href="/upload">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white font-bold rounded-lg text-xs hover:bg-amber-600 transition-colors">
                <span className="material-symbols-outlined text-base">upload_file</span>
                Analyze my own report
              </button>
            </Link>
          </div>
        )}
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-primary/10 flex items-center justify-between px-4 sm:px-8 shrink-0 gap-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm min-w-0">
            <span className="hidden sm:inline">Reports</span>
            <span className="material-symbols-outlined text-xs hidden sm:inline">chevron_right</span>
            <span className="text-background-dark font-medium truncate">{displayFileName}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/upload">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                <span className="hidden sm:inline">Upload New Report</span>
              </button>
            </Link>
            {user && (
              <div className="items-center gap-3 pl-6 border-l border-stone-200 hidden md:flex">
                <div className="text-right min-w-0">
                  <p className="text-sm font-semibold text-background-dark leading-tight truncate">{user.name}</p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content: Split Pane */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* Left Pane: Document Preview */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col bg-stone-100">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-lg">attachment</span>
              {isSample ? 'Sample Document' : 'Original Document'}
            </h3>
            {isSample ? (
              <SampleDocument />
            ) : (
              <OriginalDocument
                reportId={hasStoredFile ? review!.reportId : null}
                mimeType={review?.mimeType ?? null}
                fileName={displayFileName}
                testResults={displayAnalysis.testResults}
                reportDate={displayAnalysis.reportDate}
                reportType={displayAnalysis.reportType}
              />
            )}
          </div>

          <ReportAnalysisPanel
            analysis={displayAnalysis}
            reportType={displayAnalysis.reportType}
            generatedOn={new Date().toLocaleDateString('en-US')}
            actions={
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm"
                onClick={async () => {
                  const mod = await import('../../utils/pdf')
                  mod.generateSummaryPDF(displayAnalysis, (displayFileName || 'MedSight_Summary') + '.pdf')
                }}
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
            }
            footer={
              <section className="border border-amber-200 bg-amber-50 rounded-xl p-5 flex gap-3">
                <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
                <p className="text-sm text-amber-900 leading-relaxed">
                  <span className="font-bold">This is not medical advice.</span> This summary was
                  generated by AI from your uploaded report and may contain errors or omissions.
                  Always confirm any finding, value or medication with a qualified clinician before
                  acting on it.
                </p>
              </section>
            }
            banner={
              review ? (
                <div
                  className={`rounded-xl border p-4 mb-8 flex items-start gap-3 ${
                    review.doctorName ? 'bg-primary/5 border-primary/20' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <span className={`material-symbols-outlined ${review.doctorName ? 'text-primary' : 'text-amber-600'}`}>
                    {review.doctorName ? 'forward_to_inbox' : 'person_search'}
                  </span>
                  <div className="flex-1 min-w-0">
                    {review.doctorName ? (
                      <>
                        <p className="text-sm font-bold text-background-dark">
                          Sent to Dr. {review.doctorName} — {review.status === 'REVIEWED' ? 'Reviewed' : 'Pending review'}
                        </p>
                        {review.feedback ? (
                          <p className="text-sm text-slate-700 mt-1">
                            <span className="font-semibold">Doctor&apos;s feedback:</span> {review.feedback}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-600 mt-1">
                            Your doctor hasn&apos;t reviewed this yet.{' '}
                            <Link href="/patient" className="text-primary-dark font-semibold hover:underline">
                              Check status in My Reports
                            </Link>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-slate-700">
                        This report was saved to your account, but you haven&apos;t connected with a doctor yet.{' '}
                        <Link href="/patient" className="text-primary-dark font-semibold hover:underline">
                          Connect with a doctor
                        </Link>{' '}
                        so they can review it.
                      </p>
                    )}
                  </div>
                </div>
              ) : null
            }
          />
        </div>
      </main>

      {/* Floating Upload Button */}
      <Link href="/upload">
        <button className="fixed bottom-8 right-8 size-14 bg-primary text-background-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </Link>
    </div>
  )
}
