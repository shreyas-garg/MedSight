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
      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-custom hover:text-red-500 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
    >
      <span className="material-symbols-outlined text-lg">logout</span>
      <span className="hidden sm:inline">{loading ? 'Logging out...' : 'Log out'}</span>
    </button>
  )
}
