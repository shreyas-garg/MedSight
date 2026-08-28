'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

type CurrentUser = { id: string; name: string; role: 'PATIENT' | 'DOCTOR' } | null

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
        active ? 'text-primary-dark font-bold' : 'text-slate-custom hover:text-background-dark'
      }`}
    >
      {children}
    </Link>
  )
}

export default function AppNav() {
  const [user, setUser] = useState<CurrentUser>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoaded(true))
  }, [])

  return (
    <header className="bg-white border-b border-primary/10 shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined text-xl font-bold">clinical_notes</span>
          </div>
          <span className="text-lg font-black tracking-tight text-background-dark hidden sm:inline">MedSight</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 overflow-x-auto min-w-0">
          {loaded && user?.role === 'DOCTOR' ? (
            <>
              <NavLink href="/doctor">My Dashboard</NavLink>
              <NavLink href="/doctor/patients">Patient History</NavLink>
            </>
          ) : loaded && user?.role === 'PATIENT' ? (
            <>
              <NavLink href="/patient">My Dashboard</NavLink>
              <NavLink href="/upload">Upload</NavLink>
              <NavLink href="/health-profile">Health Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink href="/dashboard">Sample Dashboard</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {loaded && user ? (
            <LogoutButton />
          ) : loaded ? (
            <>
              <Link href="/login" className="text-xs sm:text-sm font-bold text-slate-custom hover:text-background-dark transition-colors whitespace-nowrap">
                Log in
              </Link>
              <Link href="/signup">
                <button className="bg-primary text-background-dark px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all whitespace-nowrap">
                  Sign up
                </button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
