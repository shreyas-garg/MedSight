'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import SampleDocument from '../components/SampleDocument'
import {
  SAMPLE_ANALYSIS,
  SAMPLE_FILE_NAME,
  type ReportAnalysis,
} from '../lib/sample-report'

interface UploadedFile {
  dataUrl: string
  type: string
  name: string
}

// Static classes so Tailwind's purge can see them - `text-${color}` cannot work.
const SEVERITY_STYLES: Record<
  string,
  { icon: string; icon_class: string; chip: string; label: string }
> = {
  normal: {
    icon: 'check_circle',
    icon_class: 'text-primary',
    chip: 'bg-primary/10 text-primary-dark dark:text-primary border-primary/30',
    label: 'Normal',
  },
  warning: {
    icon: 'info',
    icon_class: 'text-amber-500',
    chip: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
    label: 'Watch',
  },
  critical: {
    icon: 'warning',
    icon_class: 'text-red-500',
    chip: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30',
    label: 'Needs attention',
  },
}

const severityStyle = (severity: string) => SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.normal

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [zoom, setZoom] = useState(1)
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const storedData = sessionStorage.getItem('reportAnalysis')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setAnalysis(data.analysis)
        setFileName(data.fileName || 'Medical Report')
      } catch (err) {
        console.error('Failed to load analysis data:', err)
      }
    }

    // The original document, cached by the upload page for this session
    const storedFile = sessionStorage.getItem('reportFile')
    if (storedFile) {
      try {
        setUploadedFile(JSON.parse(storedFile))
      } catch (err) {
        console.error('Failed to load cached document:', err)
      }
    }
  }, [])

  // Nothing uploaded -> sample mode: sample summary AND a matching sample document.
  const isSample = analysis === null
  const displayAnalysis = analysis ?? SAMPLE_ANALYSIS
  const displayFileName = fileName || SAMPLE_FILE_NAME

  const isImage = !!uploadedFile?.type.startsWith('image/')
  const isPdf = uploadedFile?.type === 'application/pdf'
  const canZoom = isImage || isSample

  const patientInitials =
    displayAnalysis.patientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const copyQuestions = async () => {
    const text = displayAnalysis.questions.map((q) => `- ${q}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure origin, denied permission)
      setCopied(false)
    }
  }

  const downloadSummary = async () => {
    const mod = await import('../../utils/pdf')
    mod.generateSummaryPDF(displayAnalysis, `${displayFileName || 'MedSight_Summary'}.pdf`)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active="/dashboard" />

      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-slate-950 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-primary/10 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400 text-sm min-w-0">
            <span className="hidden sm:inline">Reports</span>
            <span className="material-symbols-outlined text-xs hidden sm:inline">chevron_right</span>
            <span className="text-background-dark dark:text-white font-medium truncate">
              {displayFileName}
            </span>
            {isSample && (
              <span className="ml-2 shrink-0 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Sample
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/upload">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                <span className="hidden sm:inline">Upload New Report</span>
              </button>
            </Link>
            <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-stone-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-background-dark dark:text-white leading-tight">
                  {displayAnalysis.patientName}
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {displayAnalysis.reportType}
                </p>
              </div>
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 font-bold text-background-dark dark:text-primary">
                {patientInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Sample-mode banner: says plainly that this is not the user's data */}
        {isSample && (
          <div className="shrink-0 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-8 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="material-symbols-outlined text-amber-500 text-xl">visibility</span>
            <p className="text-sm text-amber-900 dark:text-amber-200 flex-1 min-w-[16rem]">
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

        {/* Split Pane */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Pane: the document */}
          <div className="w-full lg:w-1/2 p-6 overflow-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-primary/10 dark:border-slate-800 flex flex-col bg-stone-100 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold text-stone-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">attachment</span>
                {isSample ? 'Sample Document' : 'Original Document'}
              </h3>
              {canZoom && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                    disabled={zoom <= 0.5}
                    aria-label="Zoom out"
                    className="p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 shadow-sm hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">zoom_out</span>
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="text-xs font-semibold text-stone-500 dark:text-slate-400 w-12 text-center hover:text-primary transition-colors"
                    title="Reset zoom"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                    disabled={zoom >= 3}
                    aria-label="Zoom in"
                    className="p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 shadow-sm hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">zoom_in</span>
                  </button>
                </div>
              )}
            </div>

            {isSample ? (
              <SampleDocument zoom={zoom} />
            ) : isImage ? (
              <div className="flex-1 bg-white rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 overflow-auto custom-scrollbar p-4">
                <img
                  src={uploadedFile!.dataUrl}
                  alt={`Uploaded medical report: ${uploadedFile!.name}`}
                  style={{ width: `${zoom * 100}%` }}
                  className="mx-auto max-w-none"
                />
              </div>
            ) : isPdf ? (
              <div className="flex-1 bg-white rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <object
                  data={uploadedFile!.dataUrl}
                  type="application/pdf"
                  className="w-full flex-1 min-h-[600px]"
                >
                  <div className="p-8 text-center text-stone-500 text-sm">
                    <p className="mb-4">Your browser cannot display this PDF inline.</p>
                    <a
                      href={uploadedFile!.dataUrl}
                      download={uploadedFile!.name}
                      className="font-semibold text-primary hover:underline"
                    >
                      Download {uploadedFile!.name}
                    </a>
                  </div>
                </object>
              </div>
            ) : (
              /* Real analysis, but the file is gone (opened from Health Profile) */
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 p-12 mx-auto w-full max-w-[800px] flex flex-col items-center justify-center text-center gap-4">
                <span className="material-symbols-outlined text-6xl text-stone-300 dark:text-slate-700">
                  description
                </span>
                <h4 className="text-lg font-bold text-background-dark dark:text-white">
                  Original file not available
                </h4>
                <p className="text-sm text-stone-500 dark:text-slate-400 max-w-sm">
                  This analysis was opened from your health profile. Uploaded files are kept only
                  for the browser session in which they were uploaded, so the document itself is no
                  longer available — the summary beside it is still yours.
                </p>
              </div>
            )}
          </div>

          {/* Right Pane: AI Summary */}
          <div className="w-full lg:w-1/2 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>AI Powered Analysis</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-background-dark dark:text-white">
                  MedSight Summary
                </h2>
                <p className="text-stone-500 dark:text-slate-400 mt-1 text-sm">
                  {displayAnalysis.reportDate} • {displayAnalysis.reportType}
                </p>
              </div>
              <button
                onClick={downloadSummary}
                title="Download this summary as a PDF you can send or hand to your doctor"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                Share with Doctor
              </button>
            </div>

            <div className="space-y-8">
              {/* Plain-language summary */}
              {displayAnalysis.summary && (
                <section className="bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 rounded-xl p-5">
                  <p className="text-stone-700 dark:text-slate-300 leading-relaxed">
                    {displayAnalysis.summary}
                  </p>
                </section>
              )}

              {/* Key Findings */}
              <section className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary text-background-dark p-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </div>
                  <h3 className="text-lg font-bold text-background-dark dark:text-white">
                    Key Findings
                  </h3>
                </div>
                {displayAnalysis.keyFindings.length === 0 ? (
                  <p className="text-sm text-stone-500 dark:text-slate-400">
                    No specific findings were extracted from this report.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {displayAnalysis.keyFindings.map((finding, index) => {
                      const style = severityStyle(finding.severity)
                      return (
                        <li key={index} className="flex gap-4">
                          <span
                            className={`material-symbols-outlined shrink-0 ${style.icon_class}`}
                          >
                            {style.icon}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={`inline-block mb-1 px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${style.chip}`}
                            >
                              {style.label}
                            </span>
                            <p className="text-stone-700 dark:text-slate-300 leading-relaxed">
                              {finding.description}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {/* Test Results */}
              {displayAnalysis.testResults.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 p-1.5 rounded-lg border border-stone-200 dark:border-slate-700">
                      <span className="material-symbols-outlined text-lg">lab_profile</span>
                    </div>
                    <h3 className="text-lg font-bold text-background-dark dark:text-white">
                      Test Results
                    </h3>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-slate-800 text-left text-xs font-bold text-stone-400 dark:text-slate-500 uppercase">
                          <th className="px-4 py-3">Test</th>
                          <th className="px-4 py-3">Result</th>
                          <th className="px-4 py-3">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayAnalysis.testResults.map((test, index) => (
                          <tr
                            key={index}
                            className="border-t border-stone-100 dark:border-slate-800"
                          >
                            <td className="px-4 py-3 font-medium text-stone-800 dark:text-slate-200">
                              {test.testName}
                            </td>
                            <td
                              className={`px-4 py-3 font-bold whitespace-nowrap ${
                                test.status === 'low'
                                  ? 'text-red-600 dark:text-red-400'
                                  : test.status === 'high'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-stone-800 dark:text-slate-200'
                              }`}
                            >
                              {test.result}
                              {test.status !== 'normal' && (
                                <span className="ml-1.5 text-[10px] font-black uppercase">
                                  {test.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-stone-500 dark:text-slate-400 whitespace-nowrap">
                              {test.referenceRange}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Medications */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 p-1.5 rounded-lg border border-stone-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-lg">pill</span>
                  </div>
                  <h3 className="text-lg font-bold text-background-dark dark:text-white">
                    Medications & Supplements
                  </h3>
                </div>
                {displayAnalysis.medications.length === 0 ? (
                  <p className="text-sm text-stone-500 dark:text-slate-400">
                    No medications or supplements were named in this report.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayAnalysis.medications.map((med, index) => (
                      <div
                        key={index}
                        className="p-4 border border-stone-100 dark:border-slate-700 rounded-xl bg-stone-50 dark:bg-slate-800/50"
                      >
                        <p className="text-xs font-semibold text-stone-400 dark:text-slate-500 uppercase mb-1">
                          From your report
                        </p>
                        <h4 className="font-bold text-background-dark dark:text-white mb-1">
                          {med.name}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-slate-400 mb-1">
                          {med.dosage}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-slate-400">{med.purpose}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Questions for Doctor - a working checklist */}
              {displayAnalysis.questions.length > 0 && (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 p-1.5 rounded-lg border border-stone-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-lg">question_answer</span>
                      </div>
                      <h3 className="text-lg font-bold text-background-dark dark:text-white">
                        Questions for your Doctor
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-stone-400 dark:text-slate-500">
                        {checkedQuestions.size}/{displayAnalysis.questions.length} asked
                      </span>
                      <button
                        onClick={copyQuestions}
                        className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          {copied ? 'check' : 'content_copy'}
                        </span>
                        {copied ? 'Copied' : 'Copy all'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {displayAnalysis.questions.map((question, index) => {
                      const isChecked = checkedQuestions.has(index)
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-primary/5 border-primary/40 dark:bg-primary/10'
                              : 'bg-white dark:bg-slate-800/40 border-stone-200 dark:border-slate-700 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleQuestion(index)}
                            className="size-5 shrink-0 rounded border-2 border-primary/40 text-primary focus:ring-primary/40 cursor-pointer"
                          />
                          <p
                            className={`font-medium transition-colors ${
                              isChecked
                                ? 'text-stone-400 dark:text-slate-500 line-through'
                                : 'text-stone-700 dark:text-slate-300'
                            }`}
                          >
                            {question}
                          </p>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-xs text-stone-400 dark:text-slate-500 mt-3">
                    Tick these off during your appointment. Ticks are not saved between visits.
                  </p>
                </section>
              )}

              {/* Medical disclaimer */}
              <section className="border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 flex gap-3">
                <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold">This is not medical advice.</span> This summary was
                  generated by AI from your uploaded report and may contain errors or omissions.
                  Always confirm any finding, value or medication with a qualified clinician before
                  acting on it.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Upload Button */}
      <Link href="/upload">
        <button
          title="Upload a new report"
          className="fixed bottom-8 right-8 size-14 bg-primary text-background-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 lg:hidden"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </Link>
    </div>
  )
}
