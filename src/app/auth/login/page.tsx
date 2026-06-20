import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Waiterstation',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>
}) {
  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">W</div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="text-gray-500 text-sm mt-1">We'll send a magic link to your email</p>
      </div>
      <LoginForm />
    </div>
  )
}
