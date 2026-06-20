import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page Not Found | Waiterstation' }

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">This page doesn't exist</h1>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
        The link may be broken or the page may have moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-emerald-700 transition"
        >
          Browse jobs
        </a>
        <a
          href="/post-job"
          className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-md text-sm hover:bg-gray-50 transition"
        >
          Post a job
        </a>
      </div>
    </div>
  )
}
