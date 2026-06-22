import type { Metadata } from 'next'
import CommunityClient from './CommunityClient'

export const metadata: Metadata = {
  title: 'Hospitality Community | Waiterstation',
  description: 'Connect with fellow hospitality workers across South Africa. Discuss salaries, share interview tips, and learn from others in the industry.',
}

export default function CommunityPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Community</h1>
          <p className="text-sm text-gray-500 mt-0.5">Discuss salaries, share tips, and support fellow hospitality workers across South Africa</p>
        </div>
      </div>
      <CommunityClient />
    </>
  )
}
