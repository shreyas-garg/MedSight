'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = 'PATIENT' | 'DOCTOR'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('PATIENT')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      router.push(data.user.role === 'DOCTOR' ? '/doctor' : '/patient')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined text-2xl font-bold">clinical_notes</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-background-dark">MedSight</h1>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-black text-background-dark mb-1">Create your account</h2>
          <p className="text-sm text-slate-custom mb-8">Get started with MedSight</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                role === 'PATIENT' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-primary">personal_injury</span>
              <span className="text-sm font-bold text-background-dark">I&apos;m a Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                role === 'DOCTOR' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-primary">stethoscope</span>
              <span className="text-sm font-bold text-background-dark">I&apos;m a Doctor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-background-dark mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="Alex Rivera"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-background-dark mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-background-dark mb-2">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background-dark px-6 py-3.5 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-custom mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-dark font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
