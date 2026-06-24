import { Skeleton } from '@/components/Skeleton'

export default function CompaniesLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
      <Skeleton className="h-7 w-56 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
