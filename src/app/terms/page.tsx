import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Waiterstation',
  description: 'Terms of service for using Waiterstation.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">1. Acceptance of terms</h2>
          <p>
            By using Waiterstation ("the platform", "we", "our"), you agree to these terms. If you don't
            agree, please don't use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">2. What Waiterstation is</h2>
          <p>
            Waiterstation is a job board that connects hospitality workers with employers in South Africa.
            We do not act as an employer, recruiter, or employment agency. We are a platform that
            facilitates introductions between workers and employers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">3. For workers</h2>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li>You may browse and apply for jobs without creating an account</li>
            <li>You are responsible for the accuracy of any profile information you provide</li>
            <li>We do not guarantee job placement or employment outcomes</li>
            <li>All employment agreements are between you and the employer directly, Waiterstation is not a party to any employment contract</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">4. For employers</h2>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li>Listings must be for genuine, legal job vacancies in South Africa</li>
            <li>You must include accurate information, role, location, and contact details</li>
            <li>You must not post duplicate listings for the same vacancy</li>
            <li>Listings that violate the Basic Conditions of Employment Act or Labour Relations Act will be removed</li>
            <li>We reserve the right to reject or remove any listing at our discretion</li>
            <li>You are responsible for compliance with all applicable employment law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">5. Prohibited content</h2>
          <p className="mb-3">You may not post or submit content that:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500">
            <li>Is false, misleading, or fraudulent</li>
            <li>Violates any South African law or regulation</li>
            <li>Is discriminatory based on race, gender, religion, disability, or any other protected characteristic</li>
            <li>Advertises illegal activities</li>
            <li>Is designed to harvest personal information from users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">6. Limitation of liability</h2>
          <p>
            Waiterstation is provided "as is". We do not guarantee the accuracy of job listings or the
            conduct of employers or workers using the platform. We are not liable for any loss, injury, or
            damage arising from use of the platform, including employment disputes between workers and
            employers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">7. Intellectual property</h2>
          <p>
            The Waiterstation name, logo, and platform design are our intellectual property. You may not
            reproduce or redistribute them without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">8. Governing law</h2>
          <p>
            These terms are governed by the laws of the Republic of South Africa. Any disputes will be
            subject to the jurisdiction of the South African courts.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">9. Changes to these terms</h2>
          <p>
            We may update these terms. Continued use after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-2">10. Contact</h2>
          <p>
            Questions? Email{' '}
            <a href="mailto:hello@waiterstation.co.za" className="text-gray-900 hover:underline">hello@waiterstation.co.za</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
