import { Skeleton } from '@/components/Skeleton'

function CardRowSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex gap-3">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <Skeleton className="h-2.5 w-1/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export default function JobsLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden p-4 space-y-3">
        <Skeleton className="h-11 w-full rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
        </div>
        {Array.from({ length: 6 }).map((_, i) => <CardRowSkeleton key={i} />)}
      </div>

      {/* Desktop split */}
      <div className="hidden md:flex flex-col bg-white" style={{ height: 'calc(100vh - var(--header-height))' }}>
        <div className="bg-white shrink-0">
          <div className="max-w-[1440px] mx-auto px-6 pt-4 pb-3">
            <Skeleton className="h-10 max-w-2xl rounded-xl" />
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-7 w-24 rounded-full shrink-0" />)}
            </div>
            <div className="flex gap-4 mt-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-16" />)}
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 max-w-[1440px] mx-auto w-full">
          {/* List */}
          <div className="w-[320px] lg:w-[480px] shrink-0 p-3 space-y-2 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => <CardRowSkeleton key={i} />)}
          </div>
          {/* Detail */}
          <div className="flex-1 p-7 space-y-5 overflow-hidden">
            <div className="flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-10 w-28 rounded-xl shrink-0" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-10/12" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
