import type { Metadata } from 'next'
import PostJobForm from './PostJobForm'

export const metadata: Metadata = {
  title: 'Post a Job | Waiterstation',
  description: 'Post a hospitality job in South Africa. Free during beta.',
}

export default function PostJobPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-sm text-gray-500 mt-0.5">Free during beta · Goes live after a quick review</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-28 md:py-8 md:pb-8">
          <div className="max-w-xl">
            <PostJobForm />
          </div>
        </div>
      </div>
    </>
  )
}
