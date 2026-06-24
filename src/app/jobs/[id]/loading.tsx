import { Skeleton } from '@/components/Skeleton'

export default function JobDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
      <Skeleton className="h-4 w-32" />

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2.5 py-1">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-full mt-5" />
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>

      {/* About */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-3">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
