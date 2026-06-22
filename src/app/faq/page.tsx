import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Waiterstation',
  description: 'Frequently asked questions about Waiterstation for hospitality workers and employers in South Africa.',
}

const WORKER_FAQS = [
  {
    q: 'Do I need to create an account to apply for jobs?',
    a: 'No. You can browse all jobs and apply without signing up. Creating a worker profile is optional — it lets employers find you too.',
  },
  {
    q: 'How do I apply for a job?',
    a: 'Open the job listing and tap "Apply now". Fill in your name and phone number, add an optional message, and submit. The employer receives your details directly and will be in touch.',
  },
  {
    q: 'Do I need to send a CV?',
    a: 'No CV is required. Just your name and phone number. The employer will ask for anything else they need once they reach out to you.',
  },
  {
    q: 'Are these jobs real and up to date?',
    a: 'Every job is reviewed before it goes live, and employers are encouraged to remove listings once a position is filled. If you apply and don\'t hear back within a day or two, it may have been filled.',
  },
  {
    q: 'Can I save jobs to come back to later?',
    a: 'Yes — tap the bookmark icon on any job card to save it. Your saved jobs are stored on your device and accessible from the Saved Jobs page in the navigation.',
  },
  {
    q: 'What types of jobs are on Waiterstation?',
    a: 'We list jobs for waiters/waitresses, chefs, kitchen staff, bartenders, baristas, housekeeping, front desk, hosts/hostesses, managers, and other hospitality roles across South Africa.',
  },
  {
    q: 'Are there jobs outside major cities?',
    a: 'Yes — we list jobs in Cape Town, Johannesburg, Durban, Stellenbosch, Hermanus, and other hospitality hotspots. Use the location filter to search near you.',
  },
  {
    q: 'What is a Worker Profile?',
    a: 'A worker profile lets you share your experience, skills, and availability. In future, employers will be able to browse profiles and reach out to candidates directly.',
  },
]

const EMPLOYER_FAQS = [
  {
    q: 'How much does it cost to post a job?',
    a: 'Posting a job is completely free during our beta period. No credit card required.',
  },
  {
    q: 'How long does it take for my listing to go live?',
    a: 'We review every listing before publishing — usually within a few hours during business hours. You\'ll hear from us if anything needs changing.',
  },
  {
    q: 'How do candidates apply?',
    a: 'Workers apply directly on Waiterstation by filling in their name and phone number. You receive their details and reach out to them to take it further.',
  },
  {
    q: 'Can I edit my listing after it\'s published?',
    a: 'Yes. Sign in with your employer account, go to My Listings, and edit the job. Note that edits put the listing back into review before going live again.',
  },
  {
    q: 'How do I remove a listing once the job is filled?',
    a: 'Sign in, go to My Listings, and delete the job. It will be marked as expired and removed from the public listing.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'You can post a job without an account during beta. Creating an account with your email lets you manage and edit your listings later.',
  },
  {
    q: 'What information do I need to post a job?',
    a: 'Role type, job title, establishment name, location, employment type (permanent / seasonal / event), and your contact number or email. A description and pay are strongly recommended.',
  },
  {
    q: 'Can I post multiple jobs?',
    a: 'Yes — post as many positions as you need. Each listing is reviewed individually.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="py-5">
      <p className="font-semibold text-gray-900 mb-2 leading-snug">{q}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:py-10 md:pb-10">

      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Frequently asked questions</h1>
        <p className="text-sm text-gray-400">Can't find your answer? <a href="/community" className="text-gray-900 hover:underline">Ask the community</a></p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-1">For workers</h2>
        <p className="text-sm text-gray-400 mb-5">Finding and applying for hospitality jobs</p>
        <div className="bg-white rounded-lg border border-gray-200 px-5">
          {WORKER_FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-1">For employers</h2>
        <p className="text-sm text-gray-400 mb-5">Posting jobs and managing applications</p>
        <div className="bg-white rounded-lg border border-gray-200 px-5">
          {EMPLOYER_FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
        </div>
      </section>

      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="font-semibold text-gray-900 mb-1">Still stuck?</p>
        <p className="text-sm text-gray-500 mb-4">Ask a question in the community. Fellow workers and employers can help.</p>
        <a href="/community" className="text-sm font-semibold text-white bg-gray-900 px-5 py-2.5 rounded-md hover:bg-gray-800 transition inline-block">
          Go to Community
        </a>
      </div>

    </div>
  )
}
