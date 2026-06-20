import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Employers | Waiterstation',
  description: 'Post hospitality jobs in South Africa and receive on-site applications. Free during beta.',
}

const FEATURES = [
  {
    title: 'Live in hours, not days',
    body: 'Submit your listing in under 2 minutes. We review and approve it fast, typically within a few hours.',
  },
  {
    title: 'On-site applications',
    body: 'Workers apply directly on Waiterstation. You receive their name and contact number — no email threads, no portals, no middleman.',
  },
  {
    title: 'Reach the right candidates',
    body: 'Our audience is exclusively South African hospitality workers — waiters, chefs, hotel staff, baristas, and more.',
  },
  {
    title: 'Reviewed listings only',
    body: 'Every listing is checked before going live. This keeps the quality high for both workers and employers.',
  },
  {
    title: 'Local and specific',
    body: "Listings are filtered by role, location, and type. Workers find exactly what they're looking for.",
  },
  {
    title: 'Free during beta',
    body: 'Post as many jobs as you need during our beta period at no cost. No card required.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'We hired a waiter within 48 hours. Three people applied the day the listing went live.',
    name: 'Cape Town restaurant owner',
  },
  {
    quote: 'No CVs, no agencies, no drama. Just people who saw the job and were interested. Simple.',
    name: 'Durban bar manager',
  },
  {
    quote: 'The review process means quality listings. Workers actually read and apply. Quality over quantity.',
    name: 'Joburg event catering company',
  },
]

export default function EmployersPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-gray-900 text-white px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-3">For employers</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Hire hospitality staff faster
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Post a job in 2 minutes. Workers browse, find your listing, and apply directly on Waiterstation. No CVs, no portals.
          </p>
          <a
            href="/post-job"
            className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-md text-base hover:bg-emerald-500 transition"
          >
            Post a job for free
          </a>
          <p className="text-gray-500 text-xs mt-3">Free during beta · No card required · Live within hours</p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why employers choose Waiterstation</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="p-5 bg-white border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works strip */}
      <div className="bg-gray-50 border-y border-gray-200 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { step: '1', label: 'Fill in the form', sub: 'Role, location, pay, and contact details' },
              { step: '2', label: 'We review it', sub: 'Usually within a few hours' },
              { step: '3', label: 'Goes live', sub: 'Visible to all job seekers immediately' },
              { step: '4', label: 'Applications come in', sub: 'Candidates apply directly on Waiterstation' },
            ].map(({ step, label, sub }) => (
              <div key={step}>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">What employers say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-xs font-semibold text-gray-400">{t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white px-4 py-14 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to find your next hire?</h2>
        <p className="text-gray-400 text-sm mb-7 max-w-md mx-auto">
          It takes under 2 minutes. Post your listing and start receiving applications today.
        </p>
        <a
          href="/post-job"
          className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-md text-base hover:bg-emerald-500 transition"
        >
          Post a job for free
        </a>
      </div>

    </div>
  )
}
