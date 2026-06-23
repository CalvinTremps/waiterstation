/**
 * Relative-time formatting helpers. Three variants exist because different
 * surfaces want different granularity — consolidating into one would change
 * displayed text. Pick the variant that matches the surface:
 *
 *  - timeAgo:      feeds/cards — "Today", "1d ago", "3d ago", "2w ago"
 *  - timeAgoDays:  admin/employer lists — "Today", "Yesterday", "5d ago"
 *  - timeAgoFine:  activity/alerts — "12m ago", "3h ago", "2d ago"
 */

export function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

export function timeAgoDays(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export function timeAgoFine(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
