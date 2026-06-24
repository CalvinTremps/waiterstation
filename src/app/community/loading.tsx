import { Skeleton } from '@/components/Skeleton'

export default function CommunityLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
      {/* Pulse header */}
      <Skeleton className="h-28 w-full rounded-2xl" />
      {/* Composer */}
      <Skeleton className="h-12 w-full rounded-xl" />
      {/* Search */}
      <Skeleton className="h-10 w-full rounded-full" />
      {/* Post cards */}
      <div className="space-y-3 pt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="space-y-2 py-0.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
            <div className="flex gap-5 mt-4 pt-3">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
