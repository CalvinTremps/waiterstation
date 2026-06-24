/**
 * Shimmer placeholder block. Compose these to mirror a route's real layout
 * inside loading.tsx files. Styling lives in globals.css (.skeleton).
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}
