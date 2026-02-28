'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
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
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)

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
      
      // Navigate to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const event = {
        target: {
          files: [droppedFile]
        }
      } as any
      handleFileChange(event)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined text-2xl font-bold">clinical_notes</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-background-dark">MedSight</h1>
          </Link>
          <Link href="/dashboard">
            <button className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors">
              View Sample Report
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-background-dark mb-4">
            Upload Your Medical Report
          </h1>
          <p className="text-lg text-slate-custom">
            Get AI-powered insights in seconds. We support PDF and image files.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-primary/30 p-12 mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center gap-6"
          >
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary">upload_file</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-background-dark mb-2">
                {file ? file.name : 'Drop your file here or click to browse'}
              </h3>
              <p className="text-sm text-slate-custom">
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
              <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/20 rounded-lg">
                <span className="material-symbols-outlined text-primary">description</span>
                <div>
                  <p className="font-semibold text-background-dark text-sm">{file.name}</p>
                  <p className="text-xs text-slate-custom">
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-background-dark text-white px-8 py-5 rounded-2xl text-lg font-bold shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h4 className="font-bold text-background-dark mb-2">100% Private</h4>
            <p className="text-sm text-slate-custom">
              Your reports are encrypted and never stored permanently
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-2xl">bolt</span>
            </div>
            <h4 className="font-bold text-background-dark mb-2">Instant Results</h4>
            <p className="text-sm text-slate-custom">
              Get your analysis in under 30 seconds
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h4 className="font-bold text-background-dark mb-2">AI Powered</h4>
            <p className="text-sm text-slate-custom">
              Advanced AI trained on medical literature
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
