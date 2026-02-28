import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 w-full border-b border-sage-custom/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined text-2xl font-bold">clinical_notes</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-background-dark dark:text-white">MedSight</h1>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="#">How it Works</a>
            <a className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm font-semibold text-slate-custom hover:text-primary transition-colors" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold text-slate-custom hover:text-background-dark transition-colors px-4">Log in</button>
            <button className="bg-primary text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                <span className="text-xs font-bold text-sage-custom uppercase tracking-wider">Trusted by 50,000+ patients</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-background-dark dark:text-white">
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
                    See Sample
                  </button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-background-dark dark:text-white">HIPAA</span>
                  <span className="text-xs font-medium text-slate-custom uppercase">Compliant</span>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-background-dark dark:text-white">AES-256</span>
                  <span className="text-xs font-medium text-slate-custom uppercase">Encrypted</span>
                </div>
              </div>
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
                  <div className="text-xs font-mono text-slate-custom">REPORT_ANALYSIS_V2.PDF</div>
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

      {/* Trust Banner */}
      <div className="bg-white dark:bg-slate-900 py-10 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-custom"><span className="material-symbols-outlined">health_and_safety</span> HealthcareTrust</div>
          <div className="flex items-center gap-2 text-xl font-bold text-slate-custom"><span className="material-symbols-outlined">shield_moon</span> SecureMed</div>
          <div className="flex items-center gap-2 text-xl font-bold text-slate-custom"><span className="material-symbols-outlined">biotech</span> AIHealth Lab</div>
          <div className="flex items-center gap-2 text-xl font-bold text-slate-custom"><span className="material-symbols-outlined">ecg_heart</span> PatientFirst</div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-background-light dark:bg-background-dark">
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
              <h3 className="text-xl font-bold text-background-dark dark:text-white mb-4">Privacy First</h3>
              <p className="text-slate-custom dark:text-slate-400 leading-relaxed">
                Your data is encrypted end-to-end and never sold to third parties. We prioritize your confidentiality above all else, ensuring only you see your reports.
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
                Join thousands of patients who use MedSight to prepare for their doctor appointments and take control of their health data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/upload">
                  <button className="bg-primary text-background-dark px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    Upload Your First Report
                  </button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 font-medium">No credit card required for the first 2 reports.</p>
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
              <li><a className="hover:text-primary transition-colors" href="#">How it works</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Sample Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-background-dark dark:text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-custom dark:text-slate-400">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-background-dark dark:text-white mb-6 uppercase text-xs tracking-widest">Stay Updated</h4>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-custom dark:text-slate-400">Get our guide on "Questions to ask your doctor".</p>
              <div className="flex">
                <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-l-lg text-sm px-4 focus:ring-primary grow" placeholder="Email address" type="email" />
                <button className="bg-primary text-background-dark px-4 py-2 rounded-r-lg font-bold text-sm">Join</button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-custom dark:text-slate-500">© 2024 MedSight Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="text-slate-custom hover:text-primary" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="text-slate-custom hover:text-primary" href="#"><span className="material-symbols-outlined">mail</span></a>
            <a className="text-slate-custom hover:text-primary" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
          </div>
        </div>
      </footer>
    </>
  )
}
