import type { Metadata } from 'next'
import LoginForm from './LoginForm'

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
            South Africa's home for hospitality jobs
          </h2>
          <div className="space-y-5">
            {[
              { icon: '🍽️', title: 'Built for hospitality', body: 'From waiters to hotel managers — every role, every province.' },
              { icon: '⚡', title: 'Apply in seconds', body: 'No CV required. Apply with your phone number and a short message.' },
              { icon: '🏆', title: 'Trusted employers', body: 'Spur, Nando\'s, Sun International and hundreds more post here.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <span className="text-2xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
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
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Get started</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in or create a free account in seconds.</p>
          <LoginForm />
        </div>
      </div>

    </div>
  )
}
