import type { Metadata } from 'next'
import LoginForm from './LoginForm'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Sign In | Waiterstation',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left — branding panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12">
        <a href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <span className="text-gray-900 font-black text-lg">W</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Waiterstation</span>
        </a>

        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Your next hospitality job starts here
          </h2>
          <div className="space-y-5">
            {[
              { icon: 'bolt', title: 'Apply in seconds', body: 'No CV required. Apply with your phone number and a short message.' },
              { icon: 'waiter', title: 'Built for hospitality', body: 'Waiters, bartenders, chefs, baristas, hotel staff — every role across South Africa.' },
              { icon: 'bell', title: 'Get notified', body: 'Set job alerts and be the first to know when the right role comes up.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <Icon name={f.icon} className="w-6 h-6 mt-0.5 text-white" />
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs">
              Are you an employer?{' '}
              <a href="/employers" className="text-gray-300 hover:text-white font-semibold underline underline-offset-2 transition">
                Go to the employer page →
              </a>
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-xs">© 2025 Waiterstation. All rights reserved.</p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
            <span className="text-white font-black text-lg">W</span>
          </div>
          <span className="text-gray-900 font-bold text-lg tracking-tight">Waiterstation</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in or create a free job seeker account.</p>
          <LoginForm />

          {/* Mobile employer link */}
          <p className="lg:hidden text-xs text-gray-400 text-center mt-6">
            Are you an employer?{' '}
            <a href="/employers" className="text-gray-700 font-semibold hover:underline">Go here →</a>
          </p>
        </div>
      </div>

    </div>
  )
}
