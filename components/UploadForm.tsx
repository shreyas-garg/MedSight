'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  // Distinguishes "the AI call failed" from "you picked a bad file", so retry is
  // only offered for the former.
  const [analysisFailed, setAnalysisFailed] = useState(false)
  const router = useRouter()

  const selectFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (PNG, JPG, JPEG)')
      setFile(null)
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)
    setAnalysisFailed(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) selectFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setAnalysisFailed(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze report')
      }

      // Store the analysis data in sessionStorage for the dashboard
      sessionStorage.setItem('reportAnalysis', JSON.stringify(data))

      // Keep the uploaded file (as a data URL) so the dashboard can show the
      // real document immediately, without a round-trip to the file API.
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
        sessionStorage.setItem(
          'reportFile',
          JSON.stringify({ dataUrl, type: file.type, name: file.name })
        )
      } catch (e) {
        console.warn('Unable to cache file for preview', e)
        sessionStorage.removeItem('reportFile')
      }

      // Navigate to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading')
      setAnalysisFailed(true)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) selectFile(droppedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-background-dark dark:text-white mb-4">
          Upload Your Medical Report
        </h1>
        <p className="text-lg text-slate-custom dark:text-slate-400">
          Get AI-powered insights in seconds. We support PDF and image files.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`rounded-2xl border-2 border-dashed p-12 mb-8 transition-colors ${
          dragActive
            ? 'bg-primary/10 border-primary'
            : 'bg-white dark:bg-slate-900 border-primary/30 dark:border-slate-700'
        }`}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex flex-col items-center gap-6"
        >
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary">upload_file</span>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-background-dark dark:text-white mb-2">
              {file ? file.name : 'Drop your file here or click to browse'}
            </h3>
            <p className="text-sm text-slate-custom dark:text-slate-400">
              Supports PDF, PNG, JPG, JPEG (Max 10MB)
            </p>
          </div>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-primary text-background-dark px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all"
          >
            Choose File
          </label>

          {file && (
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg">
              <span className="material-symbols-outlined text-primary">description</span>
              <div>
                <p className="font-semibold text-background-dark dark:text-white text-sm">{file.name}</p>
                <p className="text-xs text-slate-custom dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="ml-4 text-stone-500 hover:text-red-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-5 mb-8 flex gap-3"
          role="alert"
        >
          <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
          <div className="flex-1">
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            {analysisFailed && (
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <button
                  onClick={handleUpload}
                  className="flex items-center gap-1.5 text-sm font-bold text-red-700 dark:text-red-400 hover:underline"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full px-8 py-5 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
          !file || uploading
            ? 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-background-dark dark:bg-primary text-white dark:text-background-dark shadow-xl hover:opacity-90'
        }`}
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Analyzing Report...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">auto_awesome</span>
            Analyze with AI
          </>
        )}
      </button>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <h4 className="font-bold text-background-dark dark:text-white mb-2">Instant Results</h4>
          <p className="text-sm text-slate-custom dark:text-slate-400">
            Get your analysis in under 30 seconds
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <h4 className="font-bold text-background-dark dark:text-white mb-2">AI Powered</h4>
          <p className="text-sm text-slate-custom dark:text-slate-400">
            Advanced AI trained on medical literature
          </p>
        </div>
      </div>
    </main>
  )
}
