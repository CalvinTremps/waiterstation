'use client'

import { useState } from 'react'

// ─── Data ──────────────────────────────────────────────────────────────────────

const ATTRACT_FEATURES = [
  {
    title: 'Create a standout job post',
    body: 'Post a role in under 2 minutes. Describe the position, set the pay, add your contact — and it goes to our team for review.',
  },
  {
    title: 'Maximise your job post results',
    body: 'Listings that include pay and clear requirements receive significantly more relevant applications.',
  },
  {
    title: 'Showcase your company',
    body: 'Your company profile is automatically created and shown to job seekers browsing your listing. Add photos, ratings, and reviews to stand out.',
  },
]

const ADVERTISE_FEATURES = [
  {
    title: 'Reach passive candidates',
    body: 'Featured listings appear at the top of relevant searches, reaching workers who aren\'t actively checking every day.',
  },
  {
    title: 'Get priority review',
    body: 'Featured listings skip the queue and go live in under 2 hours.',
  },
  {
    title: 'Performance dashboard',
    body: 'See exactly how many people viewed and applied to each listing.',
  },
]

const HIRE_FEATURES = [
  {
    title: 'Direct applications, no middleman',
    body: 'Candidates apply on Waiterstation and their contact details come straight to you — no CVs, no agencies, no email chains.',
  },
  {
    title: 'Manage all applicants in one place',
    body: 'Your employer dashboard shows every application across all your listings.',
  },
  {
    title: 'No placement fees',
    body: 'Unlike agencies that charge 10–20% of a first-year salary, Waiterstation charges nothing per hire.',
  },
]

const TABS = [
  { id: 'attract', label: 'Attract', headline: 'Attract quality candidates and build your brand', features: ATTRACT_FEATURES, cta: 'Start attracting talent', ctaHref: '/post-job' },
  { id: 'advertise', label: 'Advertise', headline: 'Get more visibility for your listing', features: ADVERTISE_FEATURES, cta: 'Learn about featured listings', ctaHref: '/employers#how-it-works' },
  { id: 'hire', label: 'Hire', headline: 'Fill your roles faster than any other channel', features: HIRE_FEATURES, cta: 'Post your first job', ctaHref: '/post-job' },
]

const LOGO_CATEGORIES = ['Featured', 'Restaurants', 'Hotels', 'Game Lodges', 'Catering', 'Bars & Clubs']

const COMPANY_LOGOS = [
  { name: 'Sun International', initial: 'S', color: 'bg-yellow-500' },
  { name: 'Tsogo Sun', initial: 'T', color: 'bg-blue-600' },
  { name: 'Marriott SA', initial: 'M', color: 'bg-red-600' },
  { name: 'Singita', initial: 'S', color: 'bg-emerald-700' },
  { name: 'Spur Group', initial: 'S', color: 'bg-orange-500' },
  { name: 'Nandos SA', initial: 'N', color: 'bg-red-500' },
]

const FAQS = [
  { q: 'How do I create a Waiterstation employer account for free?', a: 'Click "Post a Job" and fill in your listing. No account is required during beta — we review your submission and make it live. A dashboard is created once your first listing is approved.' },
  { q: 'How long does it take for my listing to go live?', a: 'Most listings are reviewed and approved within a few hours. You receive a confirmation once live.' },
  { q: 'How do candidates apply to my post?', a: 'Candidates apply on Waiterstation and their contact details are sent straight to you by email — no portal login required.' },
  { q: 'Can I edit or remove my listing after it goes live?', a: 'Yes. Log into your employer dashboard at /employer to manage, edit, renew, or remove any active listings.' },
  { q: 'How much does it cost to post a job?', a: 'Posting is completely free during our beta. No credit card is required and you\'ll receive advance notice before any pricing changes.' },
  { q: 'Can I post without listing a salary?', a: 'Yes — the salary field is optional. However, listings that include pay typically receive significantly more applications.' },
  { q: 'What types of roles can I post?', a: 'Any hospitality role in South Africa — waiters, chefs, bartenders, baristas, housekeeping, hotel front desk, game rangers, spa therapists, event staff, and more.' },
  { q: 'How is Waiterstation different from general job boards?', a: 'Waiterstation is built exclusively for the South African hospitality industry. Every job seeker here works in, or is looking for, hospitality. Less noise, more relevant candidates.' },
  { q: 'Can I sponsor a job to reach more candidates?', a: 'Sponsored / featured listings are coming soon. Join the waitlist and we\'ll notify you as soon as they\'re available.' },
  { q: 'How long is a listing visible?', a: 'Listings remain live for 60 days and can be renewed from your employer dashboard.' },
  { q: 'Why is my job not showing up?', a: 'Listings go live after a quick review by our team. If it\'s been more than 24 hours and your listing isn\'t live, contact us at hello@waiterstation.co.za.' },
  { q: 'How is Waiterstation different from recruitment agencies?', a: 'There are no placement fees, no middlemen, and no exclusivity. Post a job, receive direct applications, hire whoever you like — then post again for free.' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function EndToEndSection() {
  const [activeTab, setActiveTab] = useState('attract')
  const [openIdx, setOpenIdx] = useState(0)
  const tab = TABS.find(t => t.id === activeTab)!

  return (
    <section className="bg-white px-4 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          Everything you need for<br />end-to-end hiring
        </h2>

        {/* Tab row */}
        <div className="border-b border-gray-200 mb-10">
          <div className="flex gap-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setOpenIdx(0) }}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
                  activeTab === t.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: accordion */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{tab.label}</p>
            <h3 className="text-lg font-bold text-gray-900 mb-6">{tab.headline}</h3>
            <div className="space-y-1">
              {tab.features.map((f, i) => (
                <div key={i} className="border-b border-gray-100">
                  <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                    className="flex items-center justify-between w-full py-3.5 text-left gap-4">
                    <span className="text-sm font-semibold text-gray-800">{f.title}</span>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIdx === i && (
                    <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-6">{f.body}</p>
                  )}
                </div>
              ))}
            </div>
            <a href={tab.ctaHref}
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-blue-600 hover:underline">
              {tab.cta} →
            </a>
          </div>

          {/* Right: UI mockup */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-gray-50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 mx-2 h-4 bg-gray-200 rounded-full" />
              </div>
              <div className="p-4 space-y-3">
                {activeTab === 'attract' && (
                  <>
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">Post a Job</div>
                        <div className="text-[10px] text-gray-400">Free · Reviewed within hours</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-7 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-emerald-700 font-medium">Senior Waiter · Cape Town</span>
                      </div>
                      <div className="h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-gray-400">The Grand Hotel</span>
                      </div>
                      <div className="h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-gray-400">R7 500 / month + tips</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-gray-400">3 fields remaining</div>
                      <div className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg">Submit listing</div>
                    </div>
                  </>
                )}
                {activeTab === 'advertise' && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2.5 bg-emerald-200 rounded-full" />
                      <span className="text-[10px] text-emerald-600 font-bold">Featured</span>
                    </div>
                    {[
                      { label: 'Views', val: '2 450', up: true },
                      { label: 'Applications', val: '38', up: true },
                      { label: 'Shortlisted', val: '6', up: false },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-[11px] text-gray-600 font-medium">{s.label}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gray-900">{s.val}</span>
                          <span className={`text-[9px] font-bold ${s.up ? 'text-emerald-600' : 'text-gray-400'}`}>{s.up ? '↑' : '—'}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {activeTab === 'hire' && (
                  <>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between mb-1">
                      <div>
                        <div className="text-xs font-bold text-emerald-800">New applicant</div>
                        <div className="text-[10px] text-emerald-600">Thabo N. · +27 82 *** ****</div>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">New</span>
                    </div>
                    {[
                      { name: 'Lerato M.', role: 'Bartender · 3 yrs', status: 'Contacted' },
                      { name: 'Sipho K.', role: 'Chef · 6 yrs', status: 'Shortlisted' },
                    ].map(a => (
                      <div key={a.name} className="flex items-center gap-2.5 p-2.5 border border-gray-100 rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-blue-600">{a.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-700">{a.name}</div>
                          <div className="text-[10px] text-gray-400">{a.role}</div>
                        </div>
                        <span className="text-[10px] text-gray-400">{a.status}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-gray-100">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="flex items-start justify-between w-full py-3.5 text-left gap-4">
            <span className="text-sm text-gray-800 leading-snug">{faq.q}</span>
            <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-6">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function LogoStrip() {
  const [activeCat, setActiveCat] = useState('Featured')
  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-gray-200 mb-8 no-scrollbar">
        {LOGO_CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition ${
              activeCat === c
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {COMPANY_LOGOS.map(c => (
          <div key={c.name} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-xl ${c.color} flex items-center justify-center shadow-sm`}>
              <span className="text-white text-xl font-extrabold">{c.initial}</span>
            </div>
            <span className="text-xs text-gray-500 text-center leading-tight max-w-[70px]">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EmployersPage() {
  return (
    <div className="bg-white">

      {/* ── 1. HERO — dark bg + background photo, centered ── */}
      <div className="relative text-white overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.60) 100%), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80") center/cover no-repeat' }}>
        <div className="relative text-center px-4 py-24 md:py-32">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4">
            Waiterstation for Employers
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-2xl mx-auto">
            Hiring that's simpler, faster,<br />and more human
          </h1>
          <a href="/post-job"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-lg text-sm transition">
            Post a Job
          </a>
        </div>
      </div>

      {/* ── 2. CANDIDATE SEARCH + STAT — two-column below hero ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: candidate search widget */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">The people you're looking for are here</p>
            <form action="/post-job" className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">What are you hiring for?</label>
                <input name="prefill_title" placeholder="e.g. Waiter, Chef, Bartender"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Where are you hiring?</label>
                <input name="prefill_location" placeholder="e.g. Cape Town"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400" />
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition">
                Get started
              </button>
            </form>
          </div>

          {/* Right: big stat */}
          <div>
            <p className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-none mb-3">
              10,000+
            </p>
            <p className="text-base text-gray-600 font-medium mb-1">
              job seekers in South Africa's hospitality industry
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              Find and connect with qualified hospitality candidates on our leading, exclusively South African platform.
            </p>
            <a href="/post-job"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition">
              Get started
            </a>
          </div>
        </div>
      </div>

      {/* ── 3. END-TO-END HIRING TABS ── */}
      <EndToEndSection />

      {/* ── 4. FLEXIBLE WAYS — full-width photo background ── */}
      <div id="how-it-works" className="relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 100%), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80") center/cover no-repeat' }} />

        <div className="relative px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Flexible ways to get started
          </h2>
          <p className="text-gray-300 text-sm text-center mb-10 max-w-lg mx-auto">
            Choose the hiring option that fits your goals, budget, and schedule so you can start finding candidates right away.
          </p>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">

            {/* Post today */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-300 mb-1">Post today</p>
              <h3 className="text-lg font-bold mb-3">Try Waiterstation</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                Post a role and have it live within hours. No account required. Reach active hospitality job seekers across South Africa for free.
              </p>
              <ul className="space-y-2 mb-6">
                {['Live within hours of review', 'Visible to all job seekers', 'Direct applicant contact details', 'Unlimited listings during beta'].map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-200">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              <a href="/post-job"
                className="block text-center text-sm font-bold border border-white/40 hover:bg-white/10 text-white py-2.5 rounded-xl transition">
                Get started for free
              </a>
            </div>

            {/* Sponsor — highlighted */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                Coming soon
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">Sponsor your job</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Reach skilled talent</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Connect with quality candidates before your competitors. Featured listings are pinned to the top of relevant searches.
              </p>
              <ul className="space-y-2 mb-6">
                {['Pinned to top of search results', 'Reach passive candidates', 'Priority review — live in 2 hours', 'Dedicated performance dashboard'].map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              <a href="/post-job"
                className="block text-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition">
                Join the waitlist
              </a>
            </div>

            {/* Source candidates */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-300 mb-1">Source candidates</p>
              <h3 className="text-lg font-bold mb-3">Match the right talent, faster</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                Search our candidate database directly. Filter by role, location, experience, and certification — then reach out.
              </p>
              <ul className="space-y-2 mb-6">
                {['Search thousands of worker profiles', 'Filter by role, location & availability', 'Direct message candidates', 'See certifications and experience'].map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-200">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
              <a href="/post-job"
                className="block text-center text-sm font-bold border border-white/40 hover:bg-white/10 text-white py-2.5 rounded-xl transition">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. USED BY companies — logo strip ── */}
      <div className="bg-white border-t border-gray-100 px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">
            Used by hospitality businesses across South Africa
          </h2>
          <LogoStrip />
        </div>
      </div>

      {/* ── 6. RESOURCES ── */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">
            Resources for every step of the journey
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tag: 'How-to guide',
                title: 'Employer Guide',
                sub: 'Everything you need to write a listing, attract applicants, and hire confidently.',
                href: '/how-it-works',
                img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400&q=70',
                link: 'Find guidance →',
              },
              {
                tag: 'Thought leadership',
                title: 'Industry Insights',
                sub: 'What workers are looking for and which hospitality roles are hardest to fill right now.',
                href: '/community',
                img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=70',
                link: 'See insights →',
              },
              {
                tag: 'Purpose-built data',
                title: 'SA Salary Data',
                sub: 'Real salary ranges for waiters, chefs, bartenders, and more across South Africa.',
                href: '/companies',
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70',
                link: 'Start understanding →',
              },
            ].map(r => (
              <a key={r.title} href={r.href}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group block">
                <div className="h-36 overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{r.tag}</p>
                  <p className="text-sm font-bold text-gray-900 mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.sub}</p>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline">{r.link}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. FAQ — two-column ── */}
      <div className="bg-white border-t border-gray-100 px-4 py-14">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[260px_1fr] gap-12">
          <div className="shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
              Frequently Asked<br />Questions
            </h2>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              Can't find your answer?
            </p>
            <a href="/community" className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Ask the community →
            </a>
          </div>
          <FaqAccordion />
        </div>
      </div>

      {/* ── 8. WE'RE HERE TO HELP ── */}
      <div className="bg-gray-950 text-white px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-gray-400 mb-4">We're here to help</p>
          <div className="flex flex-wrap gap-3 mb-10">
            <a href="/how-it-works"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition">
              Employer guide
            </a>
            <a href="/community"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
              Employer support
            </a>
          </div>

          <div className="border-t border-gray-800 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Waiterstation</p>
              {[
                { href: '/', label: 'Browse jobs' },
                { href: '/companies', label: 'Companies' },
                { href: '/community', label: 'Community' },
                { href: '/about', label: 'About' },
              ].map(l => (
                <a key={l.href} href={l.href} className="block text-gray-400 hover:text-white transition mb-2 text-xs">{l.label}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Employers</p>
              {[
                { href: '/post-job', label: 'Post a job' },
                { href: '/employers', label: 'Why Waiterstation' },
                { href: '/employer', label: 'My listings' },
                { href: '/faq', label: 'FAQ' },
              ].map(l => (
                <a key={l.href} href={l.href} className="block text-gray-400 hover:text-white transition mb-2 text-xs">{l.label}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Resources</p>
              {[
                { href: '/how-it-works', label: 'How it works' },
                { href: '/community', label: 'Industry insights' },
                { href: '/companies', label: 'Salary data' },
                { href: '/faq', label: 'Help centre' },
              ].map(l => (
                <a key={l.href} href={l.href} className="block text-gray-400 hover:text-white transition mb-2 text-xs">{l.label}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Company</p>
              {[
                { href: '/about', label: 'About us' },
                { href: '/privacy', label: 'Privacy policy' },
                { href: '/terms', label: 'Terms of service' },
              ].map(l => (
                <a key={l.href} href={l.href} className="block text-gray-400 hover:text-white transition mb-2 text-xs">{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
