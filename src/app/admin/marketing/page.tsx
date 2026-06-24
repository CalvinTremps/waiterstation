import { getAllMarketingPages } from '@/lib/marketing'

export const metadata = { title: 'Marketing | Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminMarketingPage() {
  const pages = await getAllMarketingPages()

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketing pages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit the SEO and hero copy for public pages, no deploy needed. Changes go live once
          the marketing table is set up.
        </p>
      </div>

      <div className="space-y-2">
        {pages.map(p => (
          <div key={p.slug} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{p.path} · {p.seo_title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={p.path} target="_blank" rel="noreferrer"
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-lg transition">
                View live
              </a>
              <a href={`/admin/marketing/${p.slug}`}
                className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition">
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
