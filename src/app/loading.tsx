import { Skeleton } from '@/components/Skeleton'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 mt-4">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 sm:w-56 rounded-md" />
            <Skeleton className="h-12 w-32 rounded-md" />
          </div>
        </div>

        {/* Value-prop band */}
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>

      {/* Jobs card */}
      <div className="max-w-3xl mx-auto px-5 pb-10">
        <div className="border border-gray-200 rounded-lg p-5 space-y-4">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
