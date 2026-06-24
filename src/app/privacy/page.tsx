import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Waiterstation',
  description: 'How Waiterstation collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">1. Who we are</h2>
          <p>
            Waiterstation is a South African hospitality job board that connects workers and employers
            in the tourism and hospitality industry. We operate under South African law, including the
            Protection of Personal Information Act (POPIA).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">2. Information we collect</h2>
          <p className="mb-3">We collect the following categories of personal information:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li><strong className="text-gray-700">Account information</strong>, your email address when you sign in via magic link</li>
            <li><strong className="text-gray-700">Worker profile</strong>, name, phone number, location, role, experience, and availability (only if you choose to create a profile)</li>
            <li><strong className="text-gray-700">Job listings</strong>, employer name, contact number, job description, and location (submitted by employers)</li>
            <li><strong className="text-gray-700">Usage data</strong>, pages visited, filters used, and general site interaction (collected anonymously)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">3. How we use your information</h2>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li>To display job listings to workers</li>
            <li>To allow workers to create and manage profiles</li>
            <li>To allow employers to post and manage job listings</li>
            <li>To send you magic link authentication emails</li>
            <li>To improve the platform and fix bugs</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">4. Job applications</h2>
          <p>
            When you apply for a job on Waiterstation, we collect your name, phone number, and any optional
            message you provide. This information is shared directly with the employer who posted the listing
            and is stored securely in our database. We do not share your application details with any third
            parties beyond the relevant employer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">5. Data storage and security</h2>
          <p>
            Your data is stored securely using Supabase, which hosts data in the European Union (Dublin region).
            We use HTTPS for all communications and implement row-level security on all database tables.
            Passwords are never stored, we use email magic links for authentication.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">6. Saved jobs (local storage)</h2>
          <p>
            Jobs you bookmark using the save feature are stored locally on your device using your browser's
            localStorage. This data never leaves your device and is not accessible to us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">7. Your rights under POPIA</h2>
          <p className="mb-3">As a data subject under POPIA, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Object to the processing of your information</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:hello@waiterstation.co.za" className="text-gray-900 hover:underline">hello@waiterstation.co.za</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">8. Cookies</h2>
          <p>
            We use a single authentication session cookie to keep you signed in. We do not use advertising
            or tracking cookies. Your session cookie is HTTP-only and cannot be accessed by JavaScript.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We'll update the date at the top of this page when
            we do. Continued use of Waiterstation after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">10. Contact</h2>
          <p>
            Questions about this policy? Email us at{' '}
            <a href="mailto:hello@waiterstation.co.za" className="text-gray-900 hover:underline">hello@waiterstation.co.za</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
