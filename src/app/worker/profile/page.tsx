import { createServerClient, getSession } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import WorkerProfileForm from './WorkerProfileForm'
import SignOutButton from '@/app/employer/SignOutButton'

export default async function WorkerProfilePage() {
  const session = await getSession()
  if (!session) redirect('/auth/login?next=/worker/profile')

  const supabase = await createServerClient()
  const { data: profile } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Worker Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">{session.user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>

      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-28 md:py-8 md:pb-8">
          {!profile && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-800 mb-6 max-w-xl">
              Fill in your profile so employers can find you when we launch worker search in V2.
            </div>
          )}
          <div className="max-w-xl">
            <WorkerProfileForm existing={profile} />
          </div>
        </div>
      </div>
    </>
  )
}
