'use client'

import { useState } from 'react'

export type TestResult = {
  testName: string
  result: string
  value?: number | null
  unit?: string
  referenceRange?: string
  status?: string
}

export type KeyFinding = {
  severity?: string
  icon?: string
  color?: string
  description: string
}

export type Medication = { name: string; dosage?: string; purpose?: string }

export type ReportAnalysis = {
  patientName?: string
  reportDate?: string
  reportType?: string
  keyFindings?: KeyFinding[]
  testResults?: TestResult[]
  medications?: Medication[]
  questions?: string[]
  summary?: string
}

function severityIcon(severity?: string) {
  switch (severity) {
    case 'critical':
      return 'warning'
    case 'warning':
      return 'info'
    default:
      return 'check_circle'
  }
}

function statusClasses(status?: string) {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-700'
    case 'low':
    case 'high':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-primary/10 text-primary'
  }
}

/**
 * The full analysis view for one report: summary, key findings, every extracted
 * metric, medications, and questions. Shared by the patient dashboard and the
 * doctor's report view so both see exactly the same detail.
 */
export default function ReportAnalysisPanel({
  analysis,
  reportType,
  generatedOn,
  actions,
  banner,
  footer,
  questionsTitle = 'Questions for your Doctor',
  interactiveQuestions = true,
}: {
  analysis: ReportAnalysis
  reportType?: string
  generatedOn?: string
  actions?: React.ReactNode
  banner?: React.ReactNode
  footer?: React.ReactNode
  questionsTitle?: string
  interactiveQuestions?: boolean
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggle = (i: number) => {
    if (!interactiveQuestions) return
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const testResults = analysis.testResults ?? []
  const keyFindings = analysis.keyFindings ?? []
  const medications = analysis.medications ?? []
  const questions = analysis.questions ?? []

  const abnormalCount = testResults.filter((t) => t.status && t.status !== 'normal').length

  const copyQuestions = async () => {
    try {
      await navigator.clipboard.writeText(questions.map((q) => `- ${q}`).join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure origin, denied permission)
      setCopied(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:overflow-y-auto custom-scrollbar bg-white flex flex-col">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-primary font-semibold mb-1">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>AI Powered Analysis</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-background-dark">MedSight Summary</h2>
          <p className="text-stone-500 mt-1">
            {generatedOn ? `Generated on ${generatedOn}` : 'Generated'}
            {reportType ? ` • ${reportType}` : ''}
          </p>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {banner}

      <div className="space-y-8">
        {analysis.summary && (
          <section className="border border-stone-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                <span className="material-symbols-outlined text-lg">summarize</span>
              </div>
              <h3 className="text-lg font-bold text-background-dark">Overall Summary</h3>
            </div>
            <p className="text-stone-700 leading-relaxed">{analysis.summary}</p>
          </section>
        )}

        {keyFindings.length > 0 && (
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-background-dark p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </div>
              <h3 className="text-lg font-bold text-background-dark">Key Findings</h3>
            </div>
            <ul className="space-y-4">
              {keyFindings.map((finding, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    className={`material-symbols-outlined shrink-0 ${
                      finding.severity === 'critical'
                        ? 'text-red-500'
                        : finding.severity === 'warning'
                        ? 'text-amber-500'
                        : 'text-primary'
                    }`}
                  >
                    {finding.icon || severityIcon(finding.severity)}
                  </span>
                  <p className="text-stone-700 leading-relaxed">{finding.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Complete metrics - every value the AI extracted, not just the summary */}
        {testResults.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                  <span className="material-symbols-outlined text-lg">lab_profile</span>
                </div>
                <h3 className="text-lg font-bold text-background-dark">All Test Results</h3>
              </div>
              <p className="text-xs font-semibold text-stone-500">
                {testResults.length} value{testResults.length === 1 ? '' : 's'}
                {abnormalCount > 0 && <span className="text-amber-600"> • {abnormalCount} out of range</span>}
              </p>
            </div>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-stone-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="py-3 px-4 font-bold">Test</th>
                    <th className="py-3 px-4 font-bold">Result</th>
                    <th className="py-3 px-4 font-bold">Reference</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((t, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      <td className="py-3 px-4 font-semibold text-background-dark break-words">{t.testName}</td>
                      <td
                        className={`py-3 px-4 font-bold break-words ${
                          t.status === 'critical'
                            ? 'text-red-600'
                            : t.status === 'low' || t.status === 'high'
                            ? 'text-amber-600'
                            : 'text-stone-800'
                        }`}
                      >
                        {t.result}
                      </td>
                      <td className="py-3 px-4 text-stone-500 break-words">{t.referenceRange || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusClasses(t.status)}`}>
                          {t.status || 'normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {medications.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                <span className="material-symbols-outlined text-lg">pill</span>
              </div>
              <h3 className="text-lg font-bold text-background-dark">Medications &amp; Supplements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medications.map((med, index) => (
                <div key={index} className="p-4 border border-stone-100 rounded-xl bg-stone-50 min-w-0">
                  <p className="text-xs font-semibold text-stone-400 uppercase mb-1">Recommended</p>
                  <h4 className="font-bold text-background-dark mb-1 break-words">{med.name}</h4>
                  {med.dosage && <p className="text-xs text-stone-500 mb-1">{med.dosage}</p>}
                  {med.purpose && <p className="text-xs text-stone-500">{med.purpose}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {questions.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 text-stone-600 p-1.5 rounded-lg border border-stone-200">
                  <span className="material-symbols-outlined text-lg">question_answer</span>
                </div>
                <h3 className="text-lg font-bold text-background-dark">{questionsTitle}</h3>
              </div>
              {interactiveQuestions && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-400">
                    {checked.size}/{questions.length} asked
                  </span>
                  <button
                    onClick={copyQuestions}
                    className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copied' : 'Copy all'}
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const isChecked = checked.has(index)
                if (!interactiveQuestions) {
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white border border-stone-200 rounded-xl"
                    >
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">help</span>
                      <p className="font-medium text-stone-700">{question}</p>
                    </div>
                  )
                }
                return (
                  <button
                    key={index}
                    onClick={() => toggle(index)}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-primary/40 transition-colors cursor-pointer group text-left"
                  >
                    <div
                      className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                        isChecked ? 'bg-primary border-primary' : 'border-primary/40 group-hover:bg-primary/10'
                      }`}
                    >
                      {isChecked && <span className="material-symbols-outlined text-background-dark text-sm">check</span>}
                    </div>
                    <p className={`font-medium ${isChecked ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                      {question}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {footer}
      </div>
    </div>
  )
}
