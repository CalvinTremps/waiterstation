'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_SECTIONS = [
  {
    label: 'Recruitment',
    items: [
      { href: '/employer', label: 'Dashboard', icon: IconDashboard },
      { href: '/employer/pipeline', label: 'Pipeline', icon: IconPipeline },
      { href: '/employer/candidates', label: 'Find Candidates', icon: IconSearch },
      { href: '/employer/pools', label: 'Talent Pools', icon: IconPools },
      { href: '/employer/smart-alerts', label: 'Smart Alerts', badge: 3, icon: IconBell },
      { href: '/employer/listings', label: 'My Listings', icon: IconListings },
      { href: '/employer/applicants', label: 'Applicants', badge: 5, icon: IconApplicants },
      { href: '/employer/interviews', label: 'Interviews', icon: IconCalendar },
      { href: '/employer/saved', label: 'Saved Candidates', icon: IconSaved },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { href: '/employer/employees', label: 'Employees', icon: IconEmployees },
      { href: '/employer/shifts', label: 'Shifts', icon: IconShifts },
      { href: '/employer/payroll', label: 'Payroll', icon: IconPayroll },
      { href: '/employer/leave', label: 'Leave', icon: IconLeave },
      { href: '/employer/timesheets', label: 'Timesheets', icon: IconClock },
      { href: '/employer/performance', label: 'Performance', icon: IconStar },
      { href: '/employer/notices', label: 'Notice Board', icon: IconNotice },
      { href: '/employer/staff-documents', label: 'Documents', icon: IconDoc },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/employer/analytics', label: 'Analytics', icon: IconAnalytics },
      { href: '/employer/profile', label: 'Company Profile', icon: IconCompany },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  '/employer': 'Dashboard',
  '/employer/pipeline': 'Pipeline',
  '/employer/candidates': 'Find Candidates',
  '/employer/pools': 'Talent Pools',
  '/employer/smart-alerts': 'Smart Alerts',
  '/employer/listings': 'My Listings',
  '/employer/applicants': 'Applicants',
  '/employer/interviews': 'Interviews',
  '/employer/saved': 'Saved Candidates',
  '/employer/employees': 'Employees',
  '/employer/shifts': 'Shifts',
  '/employer/payroll': 'Payroll',
  '/employer/leave': 'Leave Management',
  '/employer/timesheets': 'Timesheets',
  '/employer/performance': 'Performance',
  '/employer/notices': 'Notice Board',
  '/employer/staff-documents': 'Documents',
  '/employer/analytics': 'Analytics',
  '/employer/profile': 'Company Profile',
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bypassMobile, setBypassMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-employer-app', 'true')
    return () => document.documentElement.removeAttribute('data-employer-app')
  }, [])

  function isActive(href: string) {
    if (href === '/employer') return pathname === '/employer'
    return pathname.startsWith(href)
  }

  const pageTitle = PAGE_TITLES[pathname] ?? 'Employer'

  if (isMobile && !bypassMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: '#f8f8f8' }}>
        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-bold mb-6">W</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Open on a larger screen</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
          The employer dashboard is designed for desktop and tablet. For the best experience, open Waiterstation on a laptop or tablet.
        </p>
        <a href="/" className="w-full max-w-xs flex items-center justify-center h-11 bg-gray-900 text-white text-sm font-semibold rounded-xl mb-3">
          Go to homepage
        </a>
        <button
          onClick={() => setBypassMobile(true)}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
        >
          Continue anyway
        </button>
      </div>
    )
  }

  return (
    <div className="employer-shell">
      {/* Sidebar */}
      <aside className={`employer-sidebar ${sidebarOpen ? 'employer-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="employer-sidebar__brand">
          <a href="/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">W</span>
            <span className="font-bold text-gray-900 tracking-tight text-sm">Waiterstation</span>
          </a>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 ml-9">Employer</span>
        </div>

        {/* Nav */}
        <nav className="employer-sidebar__nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="employer-nav-section">
              <p className="employer-nav-section__label">{section.label}</p>
              {section.items.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`employer-nav-item ${isActive(item.href) ? 'employer-nav-item--active' : ''}`}
                >
                  <item.icon />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="employer-nav-badge">{item.badge}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="employer-sidebar__footer">
          <a href="/post-job" className="employer-post-btn">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Post a Job
          </a>
          <div className="employer-user-row">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">CT</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Calvin Tremps</p>
              <p className="text-[10px] text-gray-400 truncate">calvintremps@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="employer-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main column */}
      <div className="employer-main">
        {/* Top bar */}
        <header className="employer-topbar">
          <button
            className="employer-topbar__menu lg:hidden"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 className="employer-topbar__title">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-3">
            <a href="/post-job"
              className="hidden sm:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Post a Job
            </a>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">CT</div>
          </div>
        </header>

        {/* Page content */}
        <main className="employer-content">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────

function IconDashboard() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
}
function IconPipeline() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
}
function IconSearch() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
}
function IconPools() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
}
function IconBell() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
}
function IconListings() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
}
function IconApplicants() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
}
function IconCalendar() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
}
function IconSaved() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
}
function IconEmployees() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
}
function IconShifts() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
}
function IconPayroll() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
}
function IconLeave() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
}
function IconClock() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
}
function IconStar() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
}
function IconNotice() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
}
function IconDoc() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
}
function IconAnalytics() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
}
function IconCompany() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
}
