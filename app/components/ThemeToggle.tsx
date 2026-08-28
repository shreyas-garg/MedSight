'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

/**
 * Toggles the `dark` class on <html>, which is what Tailwind's
 * darkMode: 'class' strategy keys off. An explicit choice is remembered in
 * localStorage; with no choice stored we follow the OS setting and keep
 * following it if the OS flips mid-session.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read the class the pre-paint script in layout.tsx already applied rather
    // than re-deriving it. The <html> class is the single source of truth, so
    // the button can never disagree with what is actually on screen.
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

    // Only track the OS while the user has not made an explicit choice.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return
      const next: Theme = e.matches ? 'dark' : 'light'
      setTheme(next)
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    // Derive from the DOM, not from state, for the same reason as above.
    const isCurrentlyDark = document.documentElement.classList.contains('dark')
    const next: Theme = isCurrentlyDark ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  // Render a stable placeholder until mounted so the server and client markup
  // match - the real theme is applied pre-paint by the script in layout.tsx.
  const isDark = mounted && theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`size-9 shrink-0 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-500 dark:text-slate-300 flex items-center justify-center hover:text-primary hover:border-primary/40 transition-colors ${className}`}
    >
      <span className="material-symbols-outlined text-lg">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
