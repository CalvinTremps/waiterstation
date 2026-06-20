import type { Metadata } from 'next'
import ApplicationsClient from './ApplicationsClient'

export const metadata: Metadata = {
  title: 'My Applications | Waiterstation',
}

export default function ApplicationsPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h1>
      <p className="text-sm text-gray-400 mb-6">Jobs you have applied to on Waiterstation.</p>
      <ApplicationsClient />
    </div>
  )
}
