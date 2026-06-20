import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | Waiterstation',
  description: 'How Waiterstation works for hospitality workers and employers in South Africa.',
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:py-10 md:pb-10">

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How Waiterstation works</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          South Africa's hospitality job board. No CVs, no portals, no friction.
        </p>
      </div>

      {/* For workers */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-gray-900 mb-6">For workers</h2>
        <div className="space-y-5">
          {[
            {
              step: '1',
              title: 'Browse jobs near you',
              body: 'Filter by role (waiter, chef, bartender, hotel...), location, and employment type. No sign-up needed to browse.',
            },
            {
              step: '2',
              title: 'Tap to see the full listing',
              body: 'Read the full job description, check the pay, and see exactly what the employer is looking for.',
            },
            {
              step: '3',
              title: 'Apply in 30 seconds',
              body: 'Tap "Apply now", enter your name and phone number, and optionally add a short message. No CV, no portal, no waiting weeks.',
            },
            {
              step: '4',
              title: 'Hear back fast',
              body: "Employers receive your details directly and reach out to you. If they're interested, you'll know quickly.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a href="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-emerald-700 transition">
            Browse jobs
          </a>
        </div>
      </section>

      <div className="border-t border-gray-100 mb-14" />

      {/* For employers */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-gray-900 mb-6">For employers</h2>
        <div className="space-y-5">
          {[
            {
              step: '1',
              title: 'Post a job in under 2 minutes',
              body: "Fill in the role, location, type, pay, and what you're looking for. Add your contact details. That's it.",
            },
            {
              step: '2',
              title: 'We review your listing',
              body: 'Every listing is checked before going live, usually within a few hours. This keeps the board quality high for everyone.',
            },
            {
              step: '3',
              title: 'Applications come in on Waiterstation',
              body: 'Candidates apply directly on the platform. You receive their name and contact number — no middleman, no portals.',
            },
            {
              step: '4',
              title: 'Hire who you want',
              body: "Reach out, interview, and hire directly. You're in full control of the process.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a href="/post-job" className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition">
            Post a job for free
          </a>
        </div>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-1">Still have questions?</h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Check our FAQ or browse the community for tips from fellow hospitality workers.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href="/faq" className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition">
            Read the FAQ
          </a>
          <a href="/community" className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition">
            Community
          </a>
        </div>
      </section>

    </div>
  )
}
