'use client'

import { useState } from 'react'

// ─── Data ──────────────────────────────────────────────────────────────────────

const FEATURE_TABS = [
  {
    id: 'post',
    label: 'Post',
    headline: 'Attract quality candidates and build your brand',
    features: [
      {
        title: 'Create a standout job post',
        body: 'Post a role in under 2 minutes. Describe the position, set the pay, add contact details — and it goes to our team for review.',
      },
      {
        title: 'Reach the right candidates',
        body: 'Our audience is exclusively South African hospitality workers — waiters, chefs, baristas, hotel staff, game rangers, and more. Every job seeker here is actively looking.',
      },
      {
        title: 'Go live within hours',
        body: 'We review every listing to maintain quality. Most go live the same day. No waiting weeks for a response.',
      },
    ],
    cta: 'Start attracting talent',
    ctaHref: '/post-job',
  },
  {
    id: 'screen',
    label: 'Screen',
    headline: 'Know who you\'re hiring before the interview',
    features: [
      {
        title: 'Direct applications, no middleman',
        body: 'Candidates apply on Waiterstation and their contact details come straight to you — no CVs, no recruitment agencies, no email chains.',
      },
      {
        title: 'Hospitality-specific profiles',
        body: 'Workers list their role category, experience, certifications (RASA, food handlers, wine), availability, and location — the things that actually matter in this industry.',
      },
      {
        title: 'Quality over quantity',
        body: 'Because every listing is reviewed and categorised, only relevant candidates see your post. Fewer, better applicants.',
      },
    ],
    cta: 'See how screening works',
    ctaHref: '/how-it-works',
  },
  {
    id: 'hire',
    label: 'Hire',
    headline: 'Fill your roles faster than any other channel',
    features: [
      {
        title: 'Applications start same day',
        body: 'Once live, your listing is immediately visible to thousands of active job seekers. Many employers receive their first applications within hours.',
      },
      {
        title: 'No commission, no placement fees',
        body: 'Unlike recruitment agencies that charge 10–20% of a first-year salary, Waiterstation charges nothing per placement. The listing is the cost.',
      },
      {
        title: 'Track applications in one place',
        body: 'All applications for your listings appear in your employer dashboard. Manage, respond, and hire without switching tools.',
      },
    ],
    cta: 'Post your first job',
    ctaHref: '/post-job',
  },
]

const HIRING_OPTIONS = [
  {
    badge: 'Free',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    title: 'Post a job',
    subtitle: 'Start hiring today',
    description: 'List your role and reach active hospitality job seekers across South Africa at no cost during our beta.',
    points: [
      'Live within hours of submission',
      'Visible to all Waiterstation job seekers',
      'Direct applicant contact details',
      'Unlimited listings during beta',
    ],
    cta: 'Post for free',
    ctaHref: '/post-job',
    ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    highlight: false,
  },
  {
    badge: 'Coming soon',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: 'Featured listing',
    subtitle: 'Get more visibility',
    description: 'Pin your listing to the top of search results and reach passive candidates who aren\'t actively browsing every day.',
    points: [
      'Pinned to top of relevant searches',
      'Highlighted badge on your listing',
      'Priority review — live in under 2 hours',
      'Performance dashboard',
    ],
    cta: 'Get notified',
    ctaHref: '/post-job',
    ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
    highlight: true,
  },
  {
    badge: 'Coming soon',
    badgeColor: 'bg-purple-100 text-purple-700',
    title: 'Talent search',
    subtitle: 'Find the right candidate',
    description: 'Search our worker profile database by role, location, experience, and certification — and reach out directly.',
    points: [
      'Search thousands of worker profiles',
      'Filter by role, location, availability',
      'Direct message candidates',
      'See certifications and experience',
    ],
    cta: 'Get notified',
    ctaHref: '/post-job',
    ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    highlight: false,
  },
]

const STATS = [
  { value: '205+', label: 'Companies listed' },
  { value: '48h', label: 'Average time to first applicant' },
  { value: '100%', label: 'SA hospitality focus' },
  { value: 'Free', label: 'During beta period' },
]

const TESTIMONIALS = [
  {
    quote: 'We hired a floor captain within 48 hours. Three people applied the day the listing went live. No agency, no fee.',
    name: 'Cape Town restaurant owner',
    role: 'Fine dining, V&A Waterfront',
    initials: 'CT',
    color: 'bg-emerald-600',
  },
  {
    quote: 'No CVs, no recruitment agencies, no drama. Just people who saw the job and were interested. Exactly what we needed.',
    name: 'Durban bar manager',
    role: 'Sports bar, Umhlanga',
    initials: 'DB',
    color: 'bg-blue-600',
  },
  {
    quote: "The review process keeps quality high. Workers here actually read the listing properly before applying. That's rare.",
    name: 'Joburg event catering manager',
    role: 'Corporate catering, Sandton',
    initials: 'JE',
    color: 'bg-purple-600',
  },
]

const RESOURCES = [
  {
    label: 'How-to guide',
    title: 'Writing a job post that gets results',
    description: 'Practical tips for writing listings that attract the right hospitality candidates quickly.',
    href: '/how-it-works',
    gradient: 'from-emerald-400 to-teal-500',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: 'Industry insight',
    title: 'SA hospitality hiring trends 2025',
    description: 'What workers are looking for and which roles are hardest to fill in the current market.',
    href: '/community',
    gradient: 'from-blue-400 to-indigo-500',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: 'Employer resource',
    title: 'Frequently asked questions',
    description: 'Everything you need to know about posting, pricing, applications, and what happens after you list.',
    href: '/faq',
    gradient: 'from-orange-400 to-rose-500',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
]

const FAQS = [
  { q: 'How do I create a Waiterstation employer account for free?', a: 'Click "Post a Job" and fill in your listing. There is no account required during beta — we review your submission and make it live. An employer dashboard is available once your first listing is approved.' },
  { q: 'How long does it take for my listing to go live?', a: 'Most listings are reviewed and approved within a few hours during business hours. You will receive a confirmation once your listing is live.' },
  { q: 'How do candidates apply?', a: 'Candidates apply directly on Waiterstation. You receive their name and contact number by email as soon as they apply — no portal login required to see applications.' },
  { q: 'Can I edit or remove my listing after it goes live?', a: 'Yes. Log in to your employer dashboard at /employer to manage, edit, renew, or remove any active listings.' },
  { q: 'How much does it cost to post a job?', a: 'Posting is completely free during our beta period. No credit card is required. We will give employers advance notice before any pricing changes.' },
  { q: 'Can I post without listing a salary?', a: 'Yes, the salary/pay field is optional. However, listings that include pay typically receive more and better-quality applications.' },
  { q: 'What types of roles can I post?', a: 'Any hospitality role in South Africa — waiters, chefs, bartenders, baristas, housekeeping, hotel front desk, game rangers, spa therapists, event staff, managers, and more.' },
  { q: 'How is Waiterstation different from general job boards?', a: 'Waiterstation is built exclusively for the South African hospitality industry. Every job seeker on the platform works in, or is looking for work in, hospitality. This means less noise and more relevant candidates for your listings.' },
]

// ─── Client components ─────────────────────────────────────────────────────────

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-gray-100">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="flex items-start justify-between w-full py-4 text-left gap-4">
            <span className="text-sm font-semibold text-gray-800 leading-snug">{faq.q}</span>
            <svg className={`w-5 h-5 text-gray-400 shrink-0 mt-0.5 transition-transform ${open === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <p className="text-sm text-gray-600 leading-relaxed pb-4 pr-8">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('post')
  const [openFeature, setOpenFeature] = useState<number>(0)
  const tab = FEATURE_TABS.find(t => t.id === activeTab)!

  return (
    <div>
      <div className="flex gap-1 bg-gray-100 rounded-full p-1 w-fit mx-auto mb-10">
        {FEATURE_TABS.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setOpenFeature(0) }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">{tab.headline}</h3>
          <div className="space-y-1">
            {tab.features.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFeature(openFeature === i ? -1 : i)}
                  className="flex items-center justify-between w-full px-4 py-3.5 text-left">
                  <span className="text-sm font-semibold text-gray-800">{f.title}</span>
                  <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFeature === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFeature === i && (
                  <p className="text-sm text-gray-500 leading-relaxed px-4 pb-4">{f.body}</p>
                )}
              </div>
            ))}
          </div>
          <a href={tab.ctaHref}
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-emerald-600 hover:underline">
            {tab.cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="flex-1 mx-3 h-5 bg-gray-200 rounded-full" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <div>
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-2 w-16 bg-gray-100 rounded mt-1" />
                </div>
              </div>
              {activeTab === 'post' && (
                <>
                  <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="h-2.5 w-28 bg-emerald-300 rounded" />
                    </div>
                    <div className="h-2 w-40 bg-emerald-200 rounded mb-1" />
                    <div className="h-2 w-32 bg-emerald-200 rounded" />
                  </div>
                  {[1,2,3].map(n => (
                    <div key={n} className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg">
                      <div className="w-6 h-6 rounded bg-gray-200 shrink-0" />
                      <div className="flex-1">
                        <div className="h-2.5 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="h-5 w-12 bg-emerald-100 rounded-full" />
                    </div>
                  ))}
                </>
              )}
              {activeTab === 'screen' && (
                <div className="space-y-2">
                  {[
                    { name: 'Thabo N.', role: 'Waiter · 4 years', badge: 'New' },
                    { name: 'Lerato M.', role: 'Bartender · 2 years', badge: 'New' },
                    { name: 'Sipho K.', role: 'Chef · 6 years', badge: '' },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">{app.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-700">{app.name}</div>
                        <div className="text-[10px] text-gray-400">{app.role}</div>
                      </div>
                      {app.badge && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{app.badge}</span>}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'hire' && (
                <>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div>
                      <div className="text-xs font-bold text-emerald-800">Waiter hired! 🎉</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Senior Waiter · Cape Town</div>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">48h</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Applications', val: '12' },
                      { label: 'Shortlisted', val: '4' },
                      { label: 'Hired', val: '1' },
                    ].map(s => (
                      <div key={s.label} className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="text-base font-bold text-gray-900">{s.val}</div>
                        <div className="text-[10px] text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EmployersPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #10b981 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              Waiterstation for Employers
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
              Hiring that's simpler, faster, and more human
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Reach thousands of active South African hospitality workers in minutes. No agencies, no CVs, no delays.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="/post-job"
                className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-lg text-sm transition">
                Post a job
              </a>
              <a href="#how-it-works"
                className="inline-block border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-7 py-3.5 rounded-lg text-sm transition">
                See how it works
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">Free during beta · No card required · Live within hours</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <form action="/post-job" className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-xs text-gray-900">
              <p className="text-xs font-semibold text-gray-500 mb-3">Post your first job in 2 minutes</p>
              <div className="space-y-2 mb-3">
                <input name="prefill_title" placeholder="What role are you hiring?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400" />
                <input name="prefill_location" placeholder="Cape Town, Johannesburg, Durban…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition">Get started →</button>
              <div className="mt-3 space-y-1.5">
                {[
                  { name: 'Thabo N.', role: 'Senior Waiter · Cape Town', exp: '5 yrs' },
                  { name: 'Lerato M.', role: 'Bartender · Johannesburg', exp: '3 yrs' },
                  { name: 'Amahle K.', role: 'Hotel Receptionist · Durban', exp: '4 yrs' },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-emerald-700">{p.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{p.role}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 shrink-0">{p.exp}</span>
                  </div>
                ))}
              </div>
            </form>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-xs text-center">
              <div className="text-3xl font-extrabold text-emerald-400">10 000+</div>
              <p className="text-sm text-gray-300 mt-1">SA hospitality job seekers on the platform</p>
              <a href="/post-job"
                className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition">
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Everything you need */}
      <div className="bg-white px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">End-to-end hiring</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Everything you need for hospitality hiring
          </h2>
          <FeatureTabs />
        </div>
      </div>

      {/* Flexible ways */}
      <div id="how-it-works" className="bg-gray-50 border-y border-gray-100 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Flexible options</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
            Flexible ways to get started
          </h2>
          <p className="text-center text-sm text-gray-500 mb-12 max-w-lg mx-auto">
            Choose the hiring option that fits your goals, budget, and schedule so you can start finding candidates right away.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {HIRING_OPTIONS.map(opt => (
              <div key={opt.title} className={`bg-white rounded-2xl border p-6 flex flex-col ${opt.highlight ? 'border-blue-300 shadow-lg shadow-blue-50 relative' : 'border-gray-200'}`}>
                {opt.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Most popular (coming soon)
                  </div>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-4 ${opt.badgeColor}`}>{opt.badge}</span>
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{opt.title}</h3>
                <p className="text-xs text-gray-400 font-medium mb-3">{opt.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{opt.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {opt.points.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
                <a href={opt.ctaHref}
                  className={`text-center text-sm font-bold py-3 rounded-xl transition ${opt.ctaStyle}`}>
                  {opt.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">
            Trusted by hospitality businesses across South Africa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works steps */}
      <div className="bg-emerald-600 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-12">From post to hire in 4 steps</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-white/20" />
            {[
              { step: '1', label: 'Fill in the form', sub: 'Role, location, pay, and contact details — takes 2 minutes' },
              { step: '2', label: 'We review it', sub: 'Usually approved within a few hours, same day' },
              { step: '3', label: 'Your listing goes live', sub: 'Immediately visible to all active job seekers' },
              { step: '4', label: 'Applications arrive', sub: 'Candidates apply directly and you get their contact details' },
            ].map(({ step, label, sub }) => (
              <div key={step} className="relative">
                <div className="w-12 h-12 rounded-full bg-white text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                  {step}
                </div>
                <p className="font-bold text-sm mb-1">{label}</p>
                <p className="text-xs text-emerald-100 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/post-job"
              className="inline-block bg-white text-emerald-600 font-bold px-7 py-3.5 rounded-lg text-sm hover:bg-emerald-50 transition">
              Post your first job →
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">What employers say</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">Real results from real employers</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col">
                <svg className="w-6 h-6 text-emerald-400 mb-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold text-white">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">
            Resources for every step of the journey
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {RESOURCES.map(r => (
              <a key={r.title} href={r.href}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition group block">
                <div className={`h-32 bg-gradient-to-br ${r.gradient} flex items-end p-4`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    {r.icon}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{r.label}</p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600 group-hover:underline">
                    Read more →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[280px_1fr] gap-12">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Everything you need to know about hiring on Waiterstation. Can't find your answer?
            </p>
            <a href="/community" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-emerald-600 hover:underline">
              Ask in the community →
            </a>
          </div>
          <FaqAccordion />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-950 text-white px-4 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">We're here to help</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to find your next hire?</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
          It takes under 2 minutes. Post your listing and start receiving direct applications from hospitality workers today.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="/post-job"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-lg text-sm transition">
            Post a job for free
          </a>
          <a href="/faq"
            className="inline-block border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-semibold px-8 py-4 rounded-lg text-sm transition">
            Read the FAQ
          </a>
        </div>
      </div>

    </div>
  )
}
