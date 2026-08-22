'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-semibold text-slate-custom hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-lg">logout</span>
      {loading ? 'Logging out...' : 'Log out'}
    </button>
  )
}
