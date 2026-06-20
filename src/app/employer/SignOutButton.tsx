'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 transition">
      Sign out
    </button>
  )
}
