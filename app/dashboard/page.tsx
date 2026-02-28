'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [fileName, setFileName] = useState<string>('')

  useEffect(() => {
    // Load analysis data from sessionStorage
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
  }, [])

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg active-nav font-medium" href="/dashboard">
            <span className="material-symbols-outlined">description</span>
            My Reports
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-primary/10 transition-colors font-medium" href="/upload">
            <span className="material-symbols-outlined">cloud_upload</span>
            New Upload
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-primary/10 transition-colors font-medium" href="#">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-primary/10 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <span>Reports</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-background-dark font-medium">{displayFileName}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/upload">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                Upload New Report
              </button>
            </Link>
            <div className="relative">
              <span className="material-symbols-outlined text-stone-500 cursor-pointer hover:text-primary transition-colors">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-stone-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-background-dark leading-tight">{displayAnalysis.patientName}</p>
                <p className="text-xs text-stone-500">Patient ID: #MS-9921</p>
              </div>
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                <img 
                  className="w-full h-full object-cover" 
                  alt="User profile avatar of patient" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACL_kFJGAd741YIuovmK5XOCX494J8o_55D3ogFlQMSV0YFkVEy9WTmoUaZqA0QxjIvLnTNwqG9UrnMJnYbqWHxhW0VEvyezUjYPvyMThmXO73KdzLJnrqXKqOnpitZwjNfx6TKsTTNSVmIdo4V811QK10IhkgiVL2sQfVmLxin7n2A8qbfMXU2EdvTh0VglMcVSLyg16RjZvWyEoNhPnwJ6Os7fukxX2cGMWv7uShnXXI1NuQePJkknOEko2kK6cbshbihJzBBR0" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content: Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Document Preview */}
          <div className="w-1/2 p-6 overflow-y-auto custom-scrollbar border-r border-primary/10 flex flex-col bg-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">attachment</span>
                Original Document
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-sm hover:bg-stone-50">
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                </button>
                <button className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-sm hover:bg-stone-50">
                  <span className="material-symbols-outlined text-lg">zoom_out</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-xl border border-stone-200 p-12 min-h-[1000px] mx-auto w-full max-w-[800px] relative">
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
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-xs font-bold text-stone-400 border-b border-stone-100 pb-2">
                  <div>TEST NAME</div>
                  <div>RESULT</div>
                  <div>REFERENCE RANGE</div>
                </div>
                {displayAnalysis.testResults.map((test, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 text-sm items-center py-2 border-b border-stone-50">
                    <div className="font-medium">{test.testName}</div>
                    <div className={`font-bold ${
                      test.status === 'low' ? 'text-red-600' : 
                      test.status === 'high' ? 'text-amber-600' : 
                      'text-stone-800'
                    }`}>
                      {test.result}
                    </div>
                    <div className="text-stone-500">{test.referenceRange}</div>
                  </div>
                ))}
              </div>
              {/* Watermark/Stamp */}
              <div className="absolute bottom-20 right-20 opacity-10 rotate-12">
                <span className="material-symbols-outlined text-[120px] text-stone-400">verified</span>
              </div>
            </div>
          </div>

          {/* Right Pane: AI Summary */}
          <div className="w-1/2 p-8 overflow-y-auto custom-scrollbar bg-white flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>AI Powered Analysis</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-background-dark">MedSight Summary</h2>
                <p className="text-stone-500 mt-1">Generated on {new Date().toLocaleDateString()} • {displayAnalysis.reportType}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-lg border border-stone-200 hover:bg-stone-200 transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
                  <span className="material-symbols-outlined text-lg">share</span>
                  Share with Doctor
                </button>
              </div>
            </div>

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
                <div className="grid grid-cols-2 gap-4">
                  {displayAnalysis.medications.map((med, index) => (
                    <div key={index} className="p-4 border border-stone-100 rounded-xl bg-stone-50">
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
                  {displayAnalysis.questions.map((question, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-primary/40 transition-colors cursor-pointer group">
                      <div className="size-5 rounded border-2 border-primary/40 group-hover:bg-primary/10 flex items-center justify-center transition-colors"></div>
                      <p className="text-stone-700 font-medium">{question}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Disclaimer */}
              <footer className="pt-8 border-t border-stone-100">
                <div className="flex gap-4 p-4 bg-stone-50 rounded-lg">
                  <span className="material-symbols-outlined text-stone-400 text-xl shrink-0">lock</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed italic">
                    Disclaimer: MedSight is an AI tool for informational purposes only. It is not a medical professional. Always consult with your doctor before making any healthcare decisions. Your medical data is encrypted and stored securely.
                  </p>
                </div>
              </footer>
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
