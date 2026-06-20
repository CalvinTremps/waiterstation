'use client'

import { useRouter } from 'next/navigation'

export default function AdminSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-gray-400 hover:text-gray-700 transition px-3 py-1.5 border border-gray-200 rounded-full"
    >
      Sign out
    </button>
  )
}
