import { cookies } from 'next/headers'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if this is the login page — login renders without the sidebar
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_session')?.value === process.env.ADMIN_PASSWORD

  if (!isLoggedIn) {
    // Login page renders standalone (middleware already handles redirects for protected routes)
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNav />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
