'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppNav from '@/components/AppNav'

interface TestResult {
  testName: string
  result: string
  referenceRange: string
  status: 'normal' | 'low' | 'high'
}

interface KeyFinding {
  severity: 'normal' | 'warning' | 'critical'
  icon: string
  color: string
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
}

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set())
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [review, setReview] = useState<ReviewStatus | null>(null)

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

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
            feedback: null,
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
          setReview((prev) => (prev ? { ...prev, status: match.status, feedback: match.feedback } : prev))
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review?.reportId])

  // If no analysis data, show sample data
  const displayAnalysis = analysis || {
    patientName: 'Alex Rivera',
    reportDate: '12/10/2023',
    reportType: 'Blood Test Summary',
    keyFindings: [
      {
        severity: 'warning',
        icon: 'info',
        color: 'amber-500',
        description: 'Your Vitamin D levels are slightly below the optimal range. This is common and can contribute to feelings of fatigue.'
      },
      {
        severity: 'critical',
        icon: 'warning',
        color: 'red-500',
        description: 'Your Hemoglobin is low (11.2 g/dL), suggesting mild anemia. This may explain any recent tiredness or shortness of breath.'
      },
      {
        severity: 'normal',
        icon: 'check_circle',
        color: 'primary',
        description: 'Your Cholesterol and WBC counts are within perfectly healthy ranges.'
      }
    ],
    testResults: [
      { testName: 'Hemoglobin (Hb)', result: '11.2 g/dL *', referenceRange: '13.5 - 17.5 g/dL', status: 'low' },
      { testName: 'WBC Count', result: '7.4 x10^9/L', referenceRange: '4.5 - 11.0 x10^9/L', status: 'normal' },
      { testName: 'Vitamin D, 25-OH', result: '22 ng/mL *', referenceRange: '30 - 100 ng/mL', status: 'low' },
      { testName: 'Serum Cholesterol', result: '188 mg/dL', referenceRange: '< 200 mg/dL', status: 'normal' }
    ],
    medications: [
      { name: 'Vitamin D3 (2000 IU)', dosage: 'Daily', purpose: 'Daily supplement to normalize levels.' },
      { name: 'Ferrous Sulfate', dosage: 'As prescribed', purpose: 'Iron supplement to address mild anemia.' }
    ],
    questions: [
      'Is my anemia related to my diet or a separate underlying cause?',
      'Should I re-test my Vitamin D levels in 3 months or 6 months?',
      'Are there specific iron-rich foods I should prioritize in my daily meals?'
    ],
    summary: 'Overall health indicators show some areas requiring attention, particularly Vitamin D and Hemoglobin levels.'
  }

  const displayFileName = fileName || 'Blood Test Summary - Oct 2023'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">
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
              Original Document
            </h3>
            <div className="shrink-0 bg-white rounded-xl shadow-xl border border-stone-200 p-6 sm:p-12 min-h-[500px] lg:min-h-[1000px] mx-auto w-full max-w-[800px] relative">
              {/* Simulated Medical Report UI */}
              <div className="border-b-2 border-stone-100 pb-8 mb-8 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">City General Hospital</h2>
                  <p className="text-stone-500 text-sm">Pathology & Laboratory Division</p>
                </div>
                <div className="text-right text-sm text-stone-500">
                  <p>Date: {displayAnalysis.reportDate}</p>
                  <p>Type: {displayAnalysis.reportType}</p>
                </div>
              </div>
              <div className="space-y-6 min-w-0">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-bold text-stone-400 border-b border-stone-100 pb-2">
                  <div className="min-w-0">TEST NAME</div>
                  <div className="min-w-0">RESULT</div>
                  <div className="min-w-0">REFERENCE RANGE</div>
                </div>
                {displayAnalysis.testResults.map((test, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 sm:gap-4 text-sm items-center py-2 border-b border-stone-50">
                    <div className="font-medium min-w-0 break-words">{test.testName}</div>
                    <div className={`font-bold min-w-0 break-words ${
                      test.status === 'low' ? 'text-red-600' :
                      test.status === 'high' ? 'text-amber-600' :
                      'text-stone-800'
                    }`}>
                      {test.result}
                    </div>
                    <div className="text-stone-500 min-w-0 break-words">{test.referenceRange}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane: AI Summary */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:overflow-y-auto custom-scrollbar bg-white flex flex-col">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
              <div>
                <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>AI Powered Analysis</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-background-dark">MedSight Summary</h2>
                <p className="text-stone-500 mt-1">Generated on {new Date().toLocaleDateString('en-US')} • {displayAnalysis.reportType}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm"
                  onClick={async () => {
                    const mod = await import('../../utils/pdf');
                    mod.generateSummaryPDF(displayAnalysis, (displayFileName || 'MedSight_Summary') + '.pdf');
                  }}
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download PDF
                </button>
              </div>
            </div>

            {review && (
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
                          <Link href="/patient" className="text-primary font-semibold hover:underline">
                            Check status in My Reports
                          </Link>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-700">
                      This report was saved to your account, but you haven&apos;t connected with a doctor yet.{' '}
                      <Link href="/patient" className="text-primary font-semibold hover:underline">
                        Connect with a doctor
                      </Link>{' '}
                      so they can review it.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Key Findings */}
              <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-background-dark p-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </div>
                  <h3 className="text-lg font-bold text-background-dark">Key Findings</h3>
                </div>
                <ul className="space-y-4">
                  {displayAnalysis.keyFindings.map((finding, index) => (
                    <li key={index} className="flex gap-4">
                      <span className={`material-symbols-outlined text-${finding.color} shrink-0`}>{finding.icon}</span>
                      <p className="text-stone-700 leading-relaxed">{finding.description}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Medications */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                    <span className="material-symbols-outlined text-lg">pill</span>
                  </div>
                  <h3 className="text-lg font-bold text-background-dark">Medications & Supplements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayAnalysis.medications.map((med, index) => (
                    <div key={index} className="p-4 border border-stone-100 rounded-xl bg-stone-50 min-w-0">
                      <p className="text-xs font-semibold text-stone-400 uppercase mb-1">Recommended</p>
                      <h4 className="font-bold text-background-dark mb-1">{med.name}</h4>
                      <p className="text-xs text-stone-500 mb-1">{med.dosage}</p>
                      <p className="text-xs text-stone-500">{med.purpose}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Questions for Doctor */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                    <span className="material-symbols-outlined text-lg">question_answer</span>
                  </div>
                  <h3 className="text-lg font-bold text-background-dark">Questions for your Doctor</h3>
                </div>
                <div className="space-y-3">
                  {displayAnalysis.questions.map((question, index) => {
                    const checked = checkedQuestions.has(index)
                    return (
                      <button
                        key={index}
                        onClick={() => toggleQuestion(index)}
                        className="w-full flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-primary/40 transition-colors cursor-pointer group text-left"
                      >
                        <div
                          className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                            checked ? 'bg-primary border-primary' : 'border-primary/40 group-hover:bg-primary/10'
                          }`}
                        >
                          {checked && <span className="material-symbols-outlined text-background-dark text-sm">check</span>}
                        </div>
                        <p className={`font-medium ${checked ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{question}</p>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Disclaimer removed */}
            </div>
          </div>
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
