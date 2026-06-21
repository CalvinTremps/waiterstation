import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Waiterstation',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>
}) {
  const { role } = await searchParams
  const isEmployer = role === 'employer'

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">W</div>
        {isEmployer ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Employer sign in</h1>
            <p className="text-gray-500 text-sm mt-1">You need an employer account to post jobs</p>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
              <p className="text-xs font-semibold text-amber-800 mb-1">First time posting?</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Enter your work email below. Once signed in, complete your company profile before posting your first job.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-500 text-sm mt-1">We'll send a magic link to your email</p>
          </>
        )}
      </div>
      <LoginForm />
    </div>
  )
}
