'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

const NAV_SECTIONS = [
  {
    label: 'Find Work',
    items: [
      { href: '/worker', exact: true, label: 'Dashboard', icon: IconDashboard },
      { href: '/worker/feed', label: 'Job Feed', badge: 3, icon: IconFeed },
      { href: '/worker/applications', label: 'My Applications', badge: 3, icon: IconApplications },
      { href: '/worker/interviews', label: 'Interviews', badge: 1, icon: IconCalendar },
      { href: '/worker/alerts', label: 'Job Alerts', icon: IconBell },
    ],
  },
  {
    label: 'My Profile',
    items: [
      { href: '/worker/profile', label: 'Profile', icon: IconProfile },
      { href: '/worker/cv', label: 'My CV', icon: IconCV },
      { href: '/worker/availability', label: 'Availability', icon: IconClock },
      { href: '/worker/history', label: 'Work History', icon: IconHistory },
      { href: '/worker/references', label: 'References', icon: IconRef },
      { href: '/worker/documents', label: 'Documents', icon: IconDoc },
    ],
  },
  {
    label: 'Resources',
    items: [
      { href: '/worker/messages', label: 'Messages', badge: 2, icon: IconMessages },
      { href: '/worker/tips', label: 'Career Tips', icon: IconTips },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  '/worker': 'Dashboard',
  '/worker/feed': 'Job Feed',
  '/worker/applications': 'My Applications',
  '/worker/interviews': 'Interviews',
  '/worker/alerts': 'Job Alerts',
  '/worker/profile': 'Profile',
  '/worker/cv': 'My CV',
  '/worker/availability': 'Availability',
  '/worker/history': 'Work History',
  '/worker/references': 'References',
  '/worker/documents': 'Documents',
  '/worker/messages': 'Messages',
  '/worker/tips': 'Career Tips',
}

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-worker-app', 'true')
    return () => document.documentElement.removeAttribute('data-worker-app')
  }, [])

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const pageTitle = PAGE_TITLES[pathname] ?? 'Worker'

  return (
    <div className="worker-shell">
      {/* Sidebar */}
      <aside className={`worker-sidebar ${sidebarOpen ? 'worker-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="worker-sidebar__brand">
          <a href={SITE_URL} className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">W</span>
            <span className="font-bold text-gray-900 tracking-tight text-sm">Waiterstation</span>
          </a>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 ml-9">Candidate Portal</span>
        </div>

        {/* Nav */}
        <nav className="worker-sidebar__nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="employer-nav-section">
              <p className="employer-nav-section__label">{section.label}</p>
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`employer-nav-item ${isActive(item.href, item.exact) ? 'employer-nav-item--active' : ''}`}
                >
                  <item.icon />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="employer-nav-badge">{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="employer-sidebar__footer">
          <a href={`${SITE_URL}/jobs`} className="employer-post-btn">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Browse Jobs
          </a>
          <div className="employer-user-row">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">AK</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Amahle Khumalo</p>
              <p className="text-[10px] text-gray-400 truncate">Senior Waiter</p>
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
            <a href={`${SITE_URL}/jobs`}
              className="hidden sm:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Browse Jobs
            </a>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 cursor-pointer">AK</div>
          </div>
        </header>

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
function IconFeed() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
}
function IconApplications() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
}
function IconCalendar() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
}
function IconBell() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
}
function IconProfile() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
}
function IconCV() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
}
function IconClock() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
}
function IconHistory() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
}
function IconRef() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
}
function IconDoc() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
}
function IconMessages() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
}
function IconTips() {
  return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
}
