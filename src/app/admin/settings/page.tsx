import ChangePasswordForm from './ChangePasswordForm'

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage admin account and platform configuration.</p>
      </div>

      {/* Admin credentials */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
        <h2 className="text-base font-bold text-gray-900 mb-1">Admin password</h2>
        <p className="text-sm text-gray-500 mb-5">
          Change the password used to access this admin panel. Set <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">ADMIN_PASSWORD</code> in your environment variables.
        </p>
        <ChangePasswordForm />
      </section>

      {/* Platform info */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Platform</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Site', value: 'Waiterstation' },
            { label: 'Market', value: 'South Africa, Hospitality' },
            { label: 'Auth method', value: 'Magic link (Supabase)' },
            { label: 'Job approval', value: 'Manual, admin required' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2">
              <span className="text-gray-500">{r.label}</span>
              <span className="font-semibold text-gray-800">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-100 p-6">
        <h2 className="text-base font-bold text-red-600 mb-1">Danger zone</h2>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Proceed with care.</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">Expire all old jobs</p>
              <p className="text-xs text-gray-400 mt-0.5">Mark listings older than 60 days as expired.</p>
            </div>
            <a href="/api/admin/expire-jobs"
              className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition">
              Run
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
