import Link from 'next/link'
import ThemeToggle from './components/ThemeToggle'

export default function HomePage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 w-full border-b border-sage-custom/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined text-2xl font-bold">clinical_notes</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-background-dark dark:text-white">MedSight</h1>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="#features">Features</a>
            <Link className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="/dashboard">Sample Report</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/health-profile" className="hidden sm:block text-sm font-bold text-slate-custom hover:text-background-dark transition-colors px-4">
              My Reports
            </Link>
            <ThemeToggle />
            <Link href="/upload">
              <button className="bg-primary text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="how-it-works" className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              {/* Trust badge removed */}
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-background-dark dark:text-white text-balance">
                Be OPD ready <br />
                <span className="text-primary italic">before</span> you step in
              </h1>
              <p className="text-lg lg:text-xl text-slate-custom dark:text-slate-300 leading-relaxed max-w-xl">
                Stop googling every symptom. MedSight turns complex medical jargon into clear, actionable summaries so you can have better conversations with your doctor.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/upload">
                  <button className="flex items-center gap-2 bg-primary text-background-dark px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                    <span className="material-symbols-outlined">upload_file</span>
                    Upload Report
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-background-dark dark:text-white border-2 border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-all">
                    <span className="material-symbols-outlined">visibility</span>
                    See Sample Report
                  </button>
                </Link>
              </div>
              {/* Compliance/Encryption badges removed */}
            </div>

            {/* Visual Element: Report UI Mockup */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-red-400"></div>
                    <div className="size-3 rounded-full bg-amber-400"></div>
                    <div className="size-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-custom dark:text-slate-400">REPORT_ANALYSIS_V2.PDF</div>
                </div>
                <div className="p-8">
                  {/* Complex Text Section */}
                  <div className="mb-8 opacity-40">
                    <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <p className="text-[10px] leading-relaxed text-slate-400 font-mono">
                      Hyperintense signal on T2-weighted imagery suggesting focal demyelination in the supratentorial compartment...
                      Ejection fraction measured at 55% with mild diastolic dysfunction. No significant lymphadenopathy noted.
                    </p>
                  </div>
                  {/* MedSight Summary */}
                  <div className="bg-primary/5 border border-primary/30 rounded-2xl p-6 relative">
                    <div className="absolute -top-3 left-6 bg-primary px-3 py-1 rounded text-[10px] font-black uppercase text-background-dark">MedSight Summary</div>
                    <h3 className="text-lg font-bold text-background-dark dark:text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                      Key Takeaways
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Your heart is pumping blood effectively, though there is slight stiffness when it relaxes between beats.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Small changes observed in brain tissue that may explain recent symptoms. Worth discussing with a neurologist.</p>
                      </li>
                    </ul>
                    <div className="mt-6 flex gap-2">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">Cardiology</span>
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">Neurology</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <div className="bg-white dark:bg-slate-900 py-12 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: '1', icon: 'upload_file', title: 'Upload', body: 'Add a photo or PDF of your report.' },
            { step: '2', icon: 'psychology', title: 'Analyse', body: 'AI reads the values and explains them in plain language.' },
            { step: '3', icon: 'picture_as_pdf', title: 'Share', body: 'Download a one-page summary to take to your doctor.' },
          ].map(({ step, icon, title, body }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Step {step}</p>
                <h3 className="font-bold text-background-dark dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-custom dark:text-slate-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background-light dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-background-dark dark:text-white mb-6">Understand your health with confidence</h2>
            <p className="text-lg text-slate-custom dark:text-slate-400 leading-relaxed">Our medical-grade AI platform bridges the gap between expert findings and patient understanding, ensuring you're never left in the dark about your own data.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Privacy Card */}
            <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">lock_person</span>
              </div>
              <h3 className="text-xl font-bold text-background-dark dark:text-white mb-4">Nothing Stored</h3>
              <p className="text-slate-custom dark:text-slate-400 leading-relaxed">
                Your report is sent to the AI for analysis and never written to our database. Summaries are saved in your own browser, on your own device, and nowhere else.
              </p>
            </div>

            {/* AI Simplification Card */}
            <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-background-dark dark:text-white mb-4">AI Simplification</h3>
              <p className="text-slate-custom dark:text-slate-400 leading-relaxed">
                Complex medical terminology is translated into layman's terms using advanced AI trained specifically on high-quality medical literature.
              </p>
            </div>

            {/* Instant Insights Card */}
            <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h3 className="text-xl font-bold text-background-dark dark:text-white mb-4">Instant Insights</h3>
              <p className="text-slate-custom dark:text-slate-400 leading-relaxed">
                Get a comprehensive summary in seconds. No more waiting days for a call back or spending hours researching confusing terms online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative bg-background-dark rounded-[2.5rem] p-12 lg:p-20 overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] -ml-32 -mb-32"></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-4xl lg:text-5xl font-black text-white max-w-2xl leading-tight">Ready to simplify your medical journey?</h2>
              <p className="text-slate-400 text-lg max-w-xl">
                Upload a report, get a plain-English summary, and walk into your appointment knowing exactly what to ask.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/upload">
                  <button className="w-full sm:w-auto bg-primary text-background-dark px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    Upload Your First Report
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all">
                    See Sample Report
                  </button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 font-medium">Free while in beta. No account needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-xl font-bold">clinical_notes</span>
              </div>
              <span className="text-xl font-black text-background-dark dark:text-white">MedSight</span>
            </div>
            <p className="text-sm text-slate-custom dark:text-slate-400 leading-relaxed">
              Empowering patients with clarity. We translate the complex world of medicine into human language.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-background-dark dark:text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-custom dark:text-slate-400">
              <li><a className="hover:text-primary transition-colors" href="#how-it-works">How it works</a></li>
              <li><a className="hover:text-primary transition-colors" href="#features">Features</a></li>
              <li><Link className="hover:text-primary transition-colors" href="/upload">Upload a report</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/dashboard">Sample report</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-background-dark dark:text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-custom dark:text-slate-400">
              <li><Link className="hover:text-primary transition-colors" href="/health-profile">My reports</Link></li>
              <li><span className="opacity-50">Privacy Policy (coming soon)</span></li>
              <li><span className="opacity-50">Terms of Service (coming soon)</span></li>
              <li><a className="hover:text-primary transition-colors" href="mailto:hello@medsight.app">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-background-dark dark:text-white mb-6 uppercase text-xs tracking-widest">Stay Updated</h4>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-custom dark:text-slate-400">Get our guide on "Questions to ask your doctor".</p>
              <div className="flex">
                <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-l-lg text-sm px-4 focus:ring-primary grow disabled:opacity-60" placeholder="Email address" type="email" disabled />
                <button className="bg-primary/60 text-background-dark px-4 py-2 rounded-r-lg font-bold text-sm cursor-not-allowed" disabled>Join</button>
              </div>
              <p className="text-xs text-slate-400">Sign-ups open soon.</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright removed */}
          <p className="text-sm text-slate-custom dark:text-slate-500">
            MedSight provides AI-generated summaries for education only. It is not a medical device
            and does not provide diagnosis or treatment advice.
          </p>
          <a className="text-slate-custom hover:text-primary" href="mailto:hello@medsight.app" aria-label="Email MedSight">
            <span className="material-symbols-outlined">mail</span>
          </a>
        </div>
      </footer>
    </>
  )
}
