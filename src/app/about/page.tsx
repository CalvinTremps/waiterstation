import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Waiterstation',
  description: 'Waiterstation is a job board for hospitality workers in South Africa.',
}

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:py-10 md:pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">About Waiterstation</h1>
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>
          Waiterstation is a job board built for South Africa's tourism and hospitality industry —
          waiters, chefs, kitchen staff, hotel workers, bartenders, and more.
        </p>
        <p>
          Most job listings elsewhere aren't built for this industry. Waiterstation is. Listings are
          specific, honest, and workers can apply in seconds directly on the platform — no CVs, no
          portals, no friction.
        </p>
        <p>
          Employers post for free during our beta. Every listing is reviewed before it goes live.
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">For workers</h2>
        <p>
          Browse jobs by role, location, and type. When you find something, tap "Apply now" and
          submit your name and phone number. The employer receives your details and reaches out
          directly — no middleman.
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">For employers</h2>
        <p>
          Post a job in under 2 minutes. It'll go live after a quick review. Applications come in
          through Waiterstation — you get the candidate's details and take it from there.
        </p>
        <div className="mt-8">
          <a href="/post-job" className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition text-sm inline-block">
            Post a Job
          </a>
        </div>
      </div>
    </div>
  )
}
