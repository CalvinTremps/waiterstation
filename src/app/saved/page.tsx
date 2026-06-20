import type { Metadata } from 'next'
import SavedJobs from './SavedJobs'

export const metadata: Metadata = {
  title: 'Saved Jobs | Waiterstation',
  description: 'Your bookmarked hospitality jobs on Waiterstation.',
}

export default function SavedPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Saved jobs</h1>
        <p className="text-sm text-gray-400 mt-0.5">Jobs you've bookmarked on this device</p>
      </div>
      <SavedJobs />
    </div>
  )
}
