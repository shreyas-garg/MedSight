'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'description', label: 'My Reports' },
  { href: '/upload', icon: 'cloud_upload', label: 'New Upload' },
  { href: '/health-profile', icon: 'monitoring', label: 'Health Profile' },
]

/**
 * Shared app sidebar. Previously copy-pasted into both /dashboard and
 * /health-profile, which meant every nav change had to be made twice.
 */
export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-primary/10 dark:border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-background-dark">analytics</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-background-dark dark:text-white">
            MedSight
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === active
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-background-dark'
                  : 'text-stone-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-stone-500 dark:text-slate-400">Appearance</span>
          <ThemeToggle />
        </div>
        <div className="bg-primary/5 dark:bg-slate-800/50 rounded-xl p-4 border border-primary/10 dark:border-slate-700">
          <p className="text-xs font-medium text-stone-600 dark:text-slate-400 mb-2">Need help?</p>
          <a
            href="mailto:hello@medsight.app"
            className="block text-center w-full py-2 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg border border-primary/20 dark:border-slate-700 shadow-sm text-background-dark dark:text-white hover:bg-primary/5 dark:hover:bg-slate-800 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </aside>
  )
}
