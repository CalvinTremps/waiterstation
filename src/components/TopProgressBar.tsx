'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Thin violet progress bar that animates across the top during route
 * navigations. Starts on internal-link clicks, ramps toward ~90%, then
 * completes when the URL (pathname or query) settles.
 *
 * Rendered inside <Suspense> in the root layout because useSearchParams()
 * requires a Suspense boundary in the App Router.
 */
export default function TopProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const firstRender = useRef(true)

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function start() {
    clearTimers()
    setVisible(true)
    setWidth(8)
    timers.current.push(setTimeout(() => setWidth(35), 120))
    timers.current.push(setTimeout(() => setWidth(62), 350))
    timers.current.push(setTimeout(() => setWidth(82), 800))
    timers.current.push(setTimeout(() => setWidth(92), 1600))
    // Safety: never leave the bar stuck if navigation is cancelled
    timers.current.push(setTimeout(() => finish(), 8000))
  }

  function finish() {
    clearTimers()
    setWidth(100)
    timers.current.push(setTimeout(() => {
      setVisible(false)
      timers.current.push(setTimeout(() => setWidth(0), 300))
    }, 200))
  }

  // Start the bar when an internal navigation link is clicked.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      const target = anchor.getAttribute('target')
      if (!href || target === '_blank' || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      // Same URL → no navigation
      if (href === pathname + (searchParams.toString() ? `?${searchParams}` : '')) return
      start()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname, searchParams])

  // Complete the bar when the route (path or query) changes.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    finish()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  if (!visible && width === 0) return null

  return (
    <div
      className="ws-topbar"
      style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
    />
  )
}
