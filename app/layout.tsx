import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MedSight | Be OPD Ready Before You Step In',
  description: 'Stop googling every symptom. MedSight turns complex medical jargon into clear, actionable summaries.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies an explicitly chosen theme before first paint. Deliberately
            does NOT follow the OS setting: the doctor/patient portal is not yet
            styled for dark mode, so defaulting everyone to light is the only
            consistent experience. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-display transition-colors">
        {children}
      </body>
    </html>
  )
}
