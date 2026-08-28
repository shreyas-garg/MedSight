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
        {/* The app is light-only for now (the portal is not styled for dark
            mode). An earlier build let users store a dark preference; clear it
            so nobody is stuck with white-on-white text from that leftover. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{localStorage.removeItem('theme');document.documentElement.classList.remove('dark')}catch(e){}})()`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light text-slate-900 antialiased font-display">
        {children}
      </body>
    </html>
  )
}
